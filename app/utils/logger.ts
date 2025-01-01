type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

const COLORS = {
  Reset: "\x1b[0m",
  Red: "\x1b[31m",
  Green: "\x1b[32m",
  Yellow: "\x1b[33m",
  Blue: "\x1b[34m",
} as const;

class Logger {
  private static renderOpts(opts: object) {
    const optsString = Object.entries(opts).map(([k, v]) => {
      return `${COLORS.Reset}${k}: ${v}`;
    });
    return `${COLORS.Reset} \n\n${optsString}`;
  }

  private static renderTimestamp(): string {
    return `${new Date(Date.now()).toISOString()}`;
  }

  private static formatMessage(
    level: LogLevel,
    message: string,
    opts?: object
  ): string {
    const color = {
      INFO: COLORS.Green,
      WARN: COLORS.Yellow,
      ERROR: COLORS.Red,
      DEBUG: COLORS.Blue,
    }[level];

    let msg = `${color}${Logger.renderTimestamp()}: ${level}: ${message}`;
    if (opts) {
      msg += Logger.renderOpts(opts);
    }
    return msg;
  }

  static info(message: string, opts?: object) {
    console.log(Logger.formatMessage("INFO", message, opts));
  }

  static warn(message: string, opts?: object) {
    console.log(Logger.formatMessage("WARN", message, opts));
  }

  static error(message: string, opts?: object) {
    console.log(Logger.formatMessage("ERROR", message, opts));
  }

  static debug(message: string, opts?: object) {
    console.log(Logger.formatMessage("DEBUG", message, opts));
  }
}

export default Logger;
