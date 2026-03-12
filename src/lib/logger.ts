const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;
type LogLevel = keyof typeof LOG_LEVELS;

const level: LogLevel = (() => {
  const env = process.env.LOG_LEVEL?.toLowerCase();
  if (env && env in LOG_LEVELS) return env as LogLevel;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
})();

const levelValue = LOG_LEVELS[level];

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

const levelBadge: Record<LogLevel, string> = {
  error: `${c.red}ERR${c.reset}`,
  warn: `${c.yellow}WRN${c.reset}`,
  info: `${c.blue}INF${c.reset}`,
  debug: `${c.cyan}DBG${c.reset}`,
};

function timestamp() {
  return `${c.dim}${new Date().toISOString().slice(11, 23)}${c.reset}`;
}

function formatTag(tag: string) {
  return `${c.gray}[${tag}]${c.reset}`;
}

function write(lvl: LogLevel, tag: string, msg: string, data?: unknown) {
  if (LOG_LEVELS[lvl] > levelValue) return;

  const parts = [timestamp(), levelBadge[lvl], formatTag(tag), msg];
  const fn = lvl === "error" ? console.error : lvl === "warn" ? console.warn : console.log;

  if (data !== undefined) {
    fn(parts.join(" "), typeof data === "string" ? data : JSON.stringify(data));
  } else {
    fn(parts.join(" "));
  }
}

// Pretty-print a config section with colored key-value pairs
function formatKV(obj: Record<string, unknown>, color: string): string {
  return Object.entries(obj)
    .map(([k, v]) => `  ${color}${k}${c.reset}${c.dim}=${c.reset}${c.white}${JSON.stringify(v)}${c.reset}`)
    .join("\n");
}

interface ConfigSection {
  label: string;
  color: string;
  data: Record<string, unknown>;
}

export function logConfigBanner(sections: ConfigSection[]) {
  if (levelValue < LOG_LEVELS.debug) return;

  const ts = timestamp();
  const badge = levelBadge.debug;
  const tag = formatTag("config");
  const divider = `${c.dim}${"─".repeat(48)}${c.reset}`;

  console.log(`\n${ts} ${badge} ${tag} ${c.bold}HopLog Configuration${c.reset}`);
  console.log(divider);

  for (const section of sections) {
    console.log(`  ${section.color}${c.bold}▸ ${section.label}${c.reset}`);
    console.log(formatKV(section.data, section.color));
    console.log();
  }

  console.log(divider);
}

export const SECTION_COLORS = {
  site: c.blue,
  theme: c.magenta,
  search: c.cyan,
  comments: c.green,
  analytics: c.yellow,
  typography: c.white,
  faq: c.green,
  profile: c.blue,
  seo: c.cyan,
};

export function createLogger(tag: string) {
  return {
    error: (msg: string, data?: unknown) => write("error", tag, msg, data),
    warn: (msg: string, data?: unknown) => write("warn", tag, msg, data),
    info: (msg: string, data?: unknown) => write("info", tag, msg, data),
    debug: (msg: string, data?: unknown) => write("debug", tag, msg, data),
    isDebug: () => levelValue >= LOG_LEVELS.debug,
  };
}

export const log = createLogger("app");
