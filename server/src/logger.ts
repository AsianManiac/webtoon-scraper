import fs from "fs/promises";
import path from "path";
import winston from "winston";

// Enum for error codes
enum ErrorCode {
  NAVIGATION_TIMEOUT = "E001",
  SELECTOR_NOT_FOUND = "E002",
  SCRAPING_FAILED = "E003",
  BROWSER_NOT_INITIALIZED = "E004",
  UNKNOWN_ERROR = "E999",
}

// Winston logger setup
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "scraper.log" }),
  ],
});

// Custom Logger class for error-specific logging
class Logger {
  private logFile: string;

  constructor(logFile: string = "scraper_error_log.log") {
    this.logFile = path.join(process.cwd(), logFile);
  }

  async log(
    message: string,
    errorCode?: ErrorCode,
    error?: Error
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${
      errorCode ? `[${errorCode}] ` : ""
    }${message}`;

    // Log to console using Winston
    logger.error(logMessage);
    if (error) {
      logger.error(error.stack || "Error stack unavailable");
    }

    // Write to file using fs
    try {
      await fs.appendFile(this.logFile, logMessage + "\n");
      if (error) {
        await fs.appendFile(this.logFile, error.stack + "\n\n");
      }
    } catch (e) {
      logger.error("Failed to write to log file:", e);
    }
  }
}

export { ErrorCode, Logger };
