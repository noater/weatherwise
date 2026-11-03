
const fs = require("node:fs");
const path = require("node:path");

const logDirectory = path.join(__dirname, "logs");
const logFile = path.join(logDirectory, "app.log");

function writeLog(level, message) {
  fs.mkdirSync(logDirectory, { recursive: true });

  const entry = `${new Date().toISOString()} [${level}] ${message}`;

  fs.appendFileSync(logFile, entry + "\n", "utf8");

  if (level === "ERROR") {
    console.error(entry);
  } else if (level === "WARN") {
    console.warn(entry);
  } else {
    console.log(entry);
  }
}

module.exports = {
  info: (message) => writeLog("INFO", message),
  warn: (message) => writeLog("WARN", message),
  error: (message) => writeLog("ERROR", message)
};
