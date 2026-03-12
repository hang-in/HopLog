import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

function renderMarkdown(md: string): Promise<string> {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(md)
    .then((file) => String(file));
}

describe("code syntax highlighting", () => {
  it("adds hljs classes to fenced code blocks with language", async () => {
    const md = "```javascript\nconst x = 1;\n```";
    const html = await renderMarkdown(md);
    expect(html).toContain("hljs");
    expect(html).toContain("hljs-keyword");
  });

  it("renders code block without language as plain pre/code", async () => {
    const md = "```\nhello world\n```";
    const html = await renderMarkdown(md);
    expect(html).toContain("<code>");
    expect(html).toContain("hello world");
  });

  it("highlights Python syntax", async () => {
    const md = "```python\ndef hello():\n    return 'world'\n```";
    const html = await renderMarkdown(md);
    expect(html).toContain("hljs");
    expect(html).toContain("hljs-keyword");
  });

  it("highlights TypeScript syntax", async () => {
    const md = "```typescript\nconst fn = (x: number): string => x.toString();\n```";
    const html = await renderMarkdown(md);
    expect(html).toContain("hljs");
    expect(html).toContain("language-typescript");
  });
});

describe("LaTeX math rendering", () => {
  it("renders inline math with KaTeX", async () => {
    const md = "The formula $E = mc^2$ is famous.";
    const html = await renderMarkdown(md);
    expect(html).toContain("katex");
    expect(html).toContain("katex-mathml");
    expect(html).toContain("katex-html");
  });

  it("renders display math with KaTeX", async () => {
    const md = "$$\n\\sum_{i=1}^n x_i\n$$";
    const html = await renderMarkdown(md);
    expect(html).toContain("katex-display");
    expect(html).toContain("katex-mathml");
  });

  it("renders aligned environment", async () => {
    const md = "$$\n\\begin{aligned}\na &= b \\\\\nc &= d\n\\end{aligned}\n$$";
    const html = await renderMarkdown(md);
    expect(html).toContain("katex-display");
    expect(html).toContain("katex-html");
  });

  it("does not render invalid LaTeX as KaTeX (strict mode off)", async () => {
    const md = "Regular text without math.";
    const html = await renderMarkdown(md);
    expect(html).not.toContain("katex");
  });

  it("renders subscripts and superscripts", async () => {
    const md = "$p_{data}(x) + p_g(x)$";
    const html = await renderMarkdown(md);
    expect(html).toContain("katex");
    expect(html).toContain("vlist");
  });
});
