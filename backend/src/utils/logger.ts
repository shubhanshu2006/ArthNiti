type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const LEVEL_COLORS: Record<LogLevel, string> = { debug: "\x1b[36m", info: "\x1b[32m", warn: "\x1b[33m", error: "\x1b[31m" };
const RESET = "\x1b[0m";

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? "debug";

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLevel];
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  if (!shouldLog(level)) return;
  const color = LEVEL_COLORS[level];
  const prefix = `${color}[${level.toUpperCase()}]${RESET} ${formatTimestamp()} [${context}]`;
  if (data !== undefined) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const logger = {
  debug: (context: string, message: string, data?: unknown) => log("debug", context, message, data),
  info: (context: string, message: string, data?: unknown) => log("info", context, message, data),
  warn: (context: string, message: string, data?: unknown) => log("warn", context, message, data),
  error: (context: string, message: string, data?: unknown) => log("error", context, message, data),
};
