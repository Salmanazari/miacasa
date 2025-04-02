export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

// Set the current log level
const currentLogLevel =
  process.env.NODE_ENV === "production"
    ? LogLevel.ERROR // Only show errors in production
    : LogLevel.DEBUG // Show all logs in development

const logLevelPriority = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
}

/**
 * Debug logging utility that respects the current log level
 * @param message The message to log
 * @param data Optional data to include with the log
 * @param level The log level (defaults to DEBUG)
 */
export function debugLog(message: string, data?: any, level: LogLevel = LogLevel.DEBUG): void {
  // Only log if the current level priority is less than or equal to the message level
  if (logLevelPriority[currentLogLevel] <= logLevelPriority[level]) {
    const timestamp = new Date().toISOString()

    switch (level) {
      case LogLevel.ERROR:
        console.error(`[${timestamp}] [ERROR] ${message}`, data || "")
        break
      case LogLevel.WARN:
        console.warn(`[${timestamp}] [WARN] ${message}`, data || "")
        break
      case LogLevel.INFO:
        console.info(`[${timestamp}] [INFO] ${message}`, data || "")
        break
      case LogLevel.DEBUG:
      default:
        console.log(`[${timestamp}] [DEBUG] ${message}`, data || "")
        break
    }
  }
}

