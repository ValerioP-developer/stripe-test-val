const winston = require("winston");
const { printf } = winston.format;

// ANSI escape codes for colors
const colors = {
  error: "\x1b[31m", // Red
  warn: "\x1b[33m", // Yellow
  info: "\x1b[36m", // Cyan
  debug: "\x1b[32m", // Green
  reset: "\x1b[0m", // Reset color
};

// Define log format for console output
const consoleFormat = printf(({ level, message, timestamp, ...rest }) => {
  const colorizedLevel = colors[level] || colors.reset;
  const restString = Object.keys(rest).length
    ? JSON.stringify(rest, null, 2)
    : "";
  return `${timestamp} ${colorizedLevel}[${level.toUpperCase()}]:${
    colors.reset
  } ${message} ${restString}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug", // Use "info" level in production and "debug" in development
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Customize timestamp format
    consoleFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/app.log",
      maxsize: 5 * 1024 * 1024, // Limit the log file size to 5MB
      maxFiles: 5, // Retain up to 5 old log files
      tailable: true, // Enable log rotation
    }),
  ],
});

module.exports = logger;
