package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
	"gopkg.in/yaml.v3"
)

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

type config struct {
	contentDir string
	postsDir   string
	meiliHost  string
	adminKey   string
	indexName  string
	debounce   time.Duration
}

func loadConfig() config {
	contentDir := envOr("CONTENT_DIR", "/app/content")
	return config{
		contentDir: contentDir,
		postsDir:   filepath.Join(contentDir, "posts"),
		meiliHost:  mustEnv("MEILISEARCH_HOST"),
		adminKey:   mustEnv("MEILISEARCH_ADMIN_KEY"),
		indexName:  envOr("MEILISEARCH_INDEX", "posts"),
		debounce:   envDuration("SYNC_DEBOUNCE_MS", 2000),
	}
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("required env var %s is not set", key)
	}
	return v
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func envDuration(key string, defaultMs int) time.Duration {
	v := os.Getenv(key)
	if v == "" {
		return time.Duration(defaultMs) * time.Millisecond
	}
	var ms int
	fmt.Sscanf(v, "%d", &ms)
	if ms <= 0 {
		ms = defaultMs
	}
	return time.Duration(ms) * time.Millisecond
}

// ---------------------------------------------------------------------------
// Meilisearch document
// ---------------------------------------------------------------------------

type document struct {
	MeiliID  string   `json:"meiliId"`
	ID       string   `json:"id"`
	Title    string   `json:"title"`
	Date     string   `json:"date"`
	Category []string `json:"category"`
	Excerpt  string   `json:"excerpt"`
	Content  string   `json:"content"`
}

// ---------------------------------------------------------------------------
// Markdown / frontmatter parsing
// ---------------------------------------------------------------------------

var (
	reCodeBlock  = regexp.MustCompile("(?s)```.*?```")
	reImage      = regexp.MustCompile(`!\[.*?\]\(.*?\)`)
	reLink       = regexp.MustCompile(`\[([^\]]*)\]\(.*?\)`)
	reHeading    = regexp.MustCompile(`#{1,6}\s+`)
	reDecoration = regexp.MustCompile(`[*_~` + "`" + `>|]`)
	reNewlines   = regexp.MustCompile(`\n+`)
)

const excerptMaxLen = 200

func generateExcerpt(content string) string {
	plain := reCodeBlock.ReplaceAllString(content, "")
	plain = reImage.ReplaceAllString(plain, "")
	plain = reLink.ReplaceAllStringFunc(plain, func(s string) string {
		m := reLink.FindStringSubmatch(s)
		if len(m) > 1 {
			return m[1]
		}
		return s
	})
	plain = reHeading.ReplaceAllString(plain, "")
	plain = reDecoration.ReplaceAllString(plain, "")
	plain = reNewlines.ReplaceAllString(plain, " ")
	plain = strings.TrimSpace(plain)

	if len([]rune(plain)) <= excerptMaxLen {
		return plain
	}
	runes := []rune(plain)[:excerptMaxLen]
	truncated := string(runes)
	if i := strings.LastIndex(truncated, " "); i > 0 {
		truncated = truncated[:i]
	}
	return truncated + "…"
}

func parsePost(filePath, postsDir string) (*document, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	fm, body, err := splitFrontmatter(data)
	if err != nil {
		return nil, fmt.Errorf("parse frontmatter %s: %w", filePath, err)
	}

	if isPrivate(fm) {
		return nil, nil // skip private posts
	}

	id := postIDFromPath(filePath, postsDir)

	return &document{
		MeiliID:  strings.ReplaceAll(id, "/", "-"),
		ID:       id,
		Title:    fmString(fm, "title"),
		Date:     fmDate(fm),
		Category: fmCategories(fm),
		Excerpt:  fmExcerptOrGenerate(fm, body),
		Content:  body,
	}, nil
}

func splitFrontmatter(data []byte) (map[string]interface{}, string, error) {
	content := string(data)
	if !strings.HasPrefix(content, "---") {
		return nil, content, nil
	}

	end := strings.Index(content[3:], "\n---")
	if end == -1 {
		return nil, content, nil
	}

	fmRaw := content[3 : 3+end]
	body := content[3+end+4:] // skip "\n---\n" (or "\n---")
	if len(body) > 0 && body[0] == '\n' {
		body = body[1:]
	}

	var fm map[string]interface{}
	if err := yaml.Unmarshal([]byte(fmRaw), &fm); err != nil {
		return nil, "", err
	}
	return fm, body, nil
}

func isPrivate(fm map[string]interface{}) bool {
	if v, ok := fm["visibility"]; ok {
		if s, ok := v.(string); ok {
			if s == "private" {
				return true
			}
			if s == "public" {
				return false
			}
		}
	}
	if v, ok := fm["public"]; ok {
		if b, ok := v.(bool); ok && !b {
			return true
		}
	}
	return false
}

func fmString(fm map[string]interface{}, key string) string {
	if v, ok := fm[key]; ok {
		return fmt.Sprintf("%v", v)
	}
	return ""
}

func fmDate(fm map[string]interface{}) string {
	v, ok := fm["date"]
	if !ok {
		return ""
	}
	switch d := v.(type) {
	case string:
		return d
	case time.Time:
		return d.Format("2006-01-02")
	default:
		return fmt.Sprintf("%v", v)
	}
}

func fmCategories(fm map[string]interface{}) []string {
	v, ok := fm["category"]
	if !ok {
		return nil
	}
	switch c := v.(type) {
	case string:
		parts := strings.Split(c, ",")
		out := make([]string, 0, len(parts))
		for _, p := range parts {
			if t := strings.TrimSpace(p); t != "" {
				out = append(out, t)
			}
		}
		return out
	case []interface{}:
		out := make([]string, 0, len(c))
		for _, item := range c {
			if s, ok := item.(string); ok {
				out = append(out, s)
			}
		}
		return out
	default:
		return nil
	}
}

func fmExcerptOrGenerate(fm map[string]interface{}, body string) string {
	if v := fmString(fm, "excerpt"); v != "" {
		return v
	}
	return generateExcerpt(body)
}

func postIDFromPath(filePath, postsDir string) string {
	rel, _ := filepath.Rel(postsDir, filePath)
	id := strings.TrimSuffix(rel, ".md")
	id = filepath.ToSlash(id)
	id = strings.TrimSuffix(id, "/index")
	return id
}

// ---------------------------------------------------------------------------
// Meilisearch client
// ---------------------------------------------------------------------------

type taskResponse struct {
	TaskUID *int `json:"taskUid"`
}

type taskStatus struct {
	Status string `json:"status"`
	Error  *struct {
		Message string `json:"message"`
	} `json:"error"`
}

func meiliRequest(cfg config, method, endpoint string, body interface{}) (*http.Response, error) {
	var reader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reader = bytes.NewReader(data)
	}

	req, err := http.NewRequest(method, cfg.meiliHost+endpoint, reader)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+cfg.adminKey)
	req.Header.Set("Content-Type", "application/json")

	return http.DefaultClient.Do(req)
}

func waitForTask(cfg config, taskUID int) error {
	for {
		resp, err := meiliRequest(cfg, "GET", fmt.Sprintf("/tasks/%d", taskUID), nil)
		if err != nil {
			return err
		}
		var ts taskStatus
		json.NewDecoder(resp.Body).Decode(&ts)
		resp.Body.Close()

		switch ts.Status {
		case "succeeded":
			return nil
		case "failed", "canceled":
			msg := fmt.Sprintf("task %d %s", taskUID, ts.Status)
			if ts.Error != nil {
				msg += ": " + ts.Error.Message
			}
			return fmt.Errorf("%s", msg)
		}
		time.Sleep(300 * time.Millisecond)
	}
}

func awaitTask(cfg config, resp *http.Response) error {
	var tr taskResponse
	json.NewDecoder(resp.Body).Decode(&tr)
	resp.Body.Close()
	if tr.TaskUID != nil {
		return waitForTask(cfg, *tr.TaskUID)
	}
	return nil
}

func ensureIndex(cfg config) error {
	resp, err := meiliRequest(cfg, "POST", "/indexes", map[string]string{
		"uid":        cfg.indexName,
		"primaryKey": "meiliId",
	})
	if err != nil {
		return err
	}
	// 200/201/202 = created, task enqueued; we also accept errors (index exists)
	if resp.StatusCode == 409 {
		resp.Body.Close()
		return nil
	}
	return awaitTask(cfg, resp)
}

func updateSettings(cfg config) error {
	settings := map[string]interface{}{
		"searchableAttributes": []string{"title", "category", "excerpt", "content"},
		"displayedAttributes":  []string{"id", "title", "date", "category", "excerpt"},
		"filterableAttributes": []string{"category"},
		"sortableAttributes":   []string{"date"},
	}
	resp, err := meiliRequest(cfg, "PATCH", fmt.Sprintf("/indexes/%s/settings", cfg.indexName), settings)
	if err != nil {
		return err
	}
	return awaitTask(cfg, resp)
}

func upsertDocuments(cfg config, docs []document) error {
	if len(docs) == 0 {
		return nil
	}
	resp, err := meiliRequest(cfg, "POST", fmt.Sprintf("/indexes/%s/documents", cfg.indexName), docs)
	if err != nil {
		return err
	}
	return awaitTask(cfg, resp)
}

func deleteDocuments(cfg config, ids []string) error {
	if len(ids) == 0 {
		return nil
	}
	resp, err := meiliRequest(cfg, "POST", fmt.Sprintf("/indexes/%s/documents/delete-batch", cfg.indexName), ids)
	if err != nil {
		return err
	}
	return awaitTask(cfg, resp)
}

type docsResponse struct {
	Results []struct {
		MeiliID string `json:"meiliId"`
	} `json:"results"`
	Offset int `json:"offset"`
	Limit  int `json:"limit"`
	Total  int `json:"total"`
}

func getAllDocumentIDs(cfg config) (map[string]bool, error) {
	ids := make(map[string]bool)
	offset := 0
	limit := 1000
	for {
		endpoint := fmt.Sprintf("/indexes/%s/documents?fields=meiliId&offset=%d&limit=%d", cfg.indexName, offset, limit)
		resp, err := meiliRequest(cfg, "GET", endpoint, nil)
		if err != nil {
			return nil, err
		}
		var dr docsResponse
		json.NewDecoder(resp.Body).Decode(&dr)
		resp.Body.Close()

		for _, r := range dr.Results {
			ids[r.MeiliID] = true
		}
		if offset+limit >= dr.Total {
			break
		}
		offset += limit
	}
	return ids, nil
}

// ---------------------------------------------------------------------------
// Sync logic
// ---------------------------------------------------------------------------

func collectAllPosts(postsDir string) []document {
	var docs []document
	filepath.Walk(postsDir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() || !strings.HasSuffix(path, ".md") {
			return nil
		}
		doc, err := parsePost(path, postsDir)
		if err != nil {
			log.Printf("warn: skip %s: %v", path, err)
			return nil
		}
		if doc != nil {
			docs = append(docs, *doc)
		}
		return nil
	})
	return docs
}

func fullSync(cfg config) error {
	log.Println("starting full sync...")
	start := time.Now()

	if err := ensureIndex(cfg); err != nil {
		return fmt.Errorf("ensure index: %w", err)
	}
	if err := updateSettings(cfg); err != nil {
		return fmt.Errorf("update settings: %w", err)
	}

	docs := collectAllPosts(cfg.postsDir)

	if err := upsertDocuments(cfg, docs); err != nil {
		return fmt.Errorf("upsert: %w", err)
	}

	// Remove stale documents
	currentIDs := make(map[string]bool, len(docs))
	for _, d := range docs {
		currentIDs[d.MeiliID] = true
	}

	existingIDs, err := getAllDocumentIDs(cfg)
	if err != nil {
		return fmt.Errorf("get existing IDs: %w", err)
	}

	var stale []string
	for id := range existingIDs {
		if !currentIDs[id] {
			stale = append(stale, id)
		}
	}

	if len(stale) > 0 {
		if err := deleteDocuments(cfg, stale); err != nil {
			return fmt.Errorf("delete stale: %w", err)
		}
		log.Printf("removed %d stale documents", len(stale))
	}

	log.Printf("full sync done: %d docs in %v", len(docs), time.Since(start).Round(time.Millisecond))
	return nil
}

// ---------------------------------------------------------------------------
// File watcher
// ---------------------------------------------------------------------------

func addDirsRecursive(w *fsnotify.Watcher, root string) error {
	return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			return w.Add(path)
		}
		return nil
	})
}

func watchAndSync(cfg config) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatalf("create watcher: %v", err)
	}
	defer watcher.Close()

	if err := addDirsRecursive(watcher, cfg.postsDir); err != nil {
		log.Fatalf("watch %s: %v", cfg.postsDir, err)
	}
	log.Printf("watching %s for changes (debounce %v)", cfg.postsDir, cfg.debounce)

	var timer *time.Timer

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}

			// Only care about markdown files and directory creation
			isDir := false
			if info, err := os.Stat(event.Name); err == nil && info.IsDir() {
				isDir = true
			}

			if isDir && event.Has(fsnotify.Create) {
				// New directory — add to watcher
				watcher.Add(event.Name)
				continue
			}

			if !strings.HasSuffix(event.Name, ".md") {
				continue
			}

			// Debounce: reset timer on each .md event
			if timer != nil {
				timer.Stop()
			}
			timer = time.AfterFunc(cfg.debounce, func() {
				if err := fullSync(cfg); err != nil {
					log.Printf("sync error: %v", err)
				}
			})

		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			log.Printf("watcher error: %v", err)
		}
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

func main() {
	log.SetFlags(log.Ltime | log.Lmsgprefix)
	log.SetPrefix("[search-sync] ")

	cfg := loadConfig()

	// Wait for Meilisearch to be ready
	waitForMeili(cfg)

	// Initial full sync
	if err := fullSync(cfg); err != nil {
		log.Fatalf("initial sync failed: %v", err)
	}

	// Watch for changes
	watchAndSync(cfg)
}

func waitForMeili(cfg config) {
	log.Printf("waiting for Meilisearch at %s...", cfg.meiliHost)
	for i := 0; i < 60; i++ {
		resp, err := meiliRequest(cfg, "GET", "/health", nil)
		if err == nil {
			resp.Body.Close()
			if resp.StatusCode == 200 {
				log.Println("Meilisearch is ready")
				return
			}
		}
		time.Sleep(time.Second)
	}
	log.Fatal("Meilisearch did not become ready within 60s")
}
