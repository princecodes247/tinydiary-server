import * as fs from 'node:fs'
import * as path from 'node:path'
import env from '../config'

type LogLevelType = 'debug' | 'info' | 'warn' | 'error' | 'slient'

const LogLevel: Record<string, LogLevelType> = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    SLIENT: 'slient',
}

type LoggerMeta = Record<string, unknown>

abstract class Logger {
    protected minLogLevel: LogLevelType

    constructor(minLogLevel: LogLevelType = LogLevel.DEBUG) {
        this.minLogLevel = minLogLevel
    }

    protected shouldLog(level: LogLevelType): boolean {
        const levels = Object.values(LogLevel)
        return levels.indexOf(level) >= levels.indexOf(this.minLogLevel)
    }

    public setMinLogLevel(level: LogLevelType): void {
        if (Object.values(LogLevel).includes(level)) {
            this.minLogLevel = level
        } else {
            throw new Error(`Invalid log level: ${level}`)
        }
    }

    public log(level: LogLevelType, message: string, meta?: LoggerMeta): void {
        if (this.shouldLog(level)) {
            this.writeLog(level, message, meta)
        }
    }

    public debug(message: string, meta?: LoggerMeta): void {
        this.log(LogLevel.DEBUG, message, meta)
    }

    public info(message: string, meta?: LoggerMeta): void {
        this.log(LogLevel.INFO, message, meta)
    }

    public warn(message: string, meta?: LoggerMeta): void {
        this.log(LogLevel.WARN, message, meta)
    }

    public error(message: string, meta?: LoggerMeta): void {
        this.log(LogLevel.ERROR, message, meta)
    }

    // Abstract method to be implemented by subclasses
    protected abstract writeLog(
        level: LogLevelType,
        message: string,
        meta?: LoggerMeta
    ): void
}

export class ConsoleLogger extends Logger {
    protected writeLog(
        level: LogLevelType,
        message: string,
        meta?: LoggerMeta
    ): void {
        console.log(`[${level.toUpperCase()}] ${message}`, meta ?? '')
    }
}

export class FileLogger extends Logger {
    private filePath: string

    constructor(filePath: string, minLogLevel: LogLevelType = LogLevel.DEBUG) {
        super(minLogLevel)
        this.filePath = path.join(path.resolve(), filePath)

        // Ensure the directory exists
        const dir = path.dirname(this.filePath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
    }

    protected writeLog(
        level: LogLevelType,
        message: string,
        meta?: LoggerMeta
    ): void {
        const logEntry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${meta ? ` ${JSON.stringify(meta)}` : ''}\n`
        fs.appendFileSync(this.filePath, logEntry)
    }
}

export class CompositeLogger extends Logger {
    private loggers: Logger[]

    constructor(...loggers: Logger[]) {
        super()
        this.loggers = loggers
    }

    protected writeLog(
        level: LogLevelType,
        message: string,
        meta?: LoggerMeta
    ): void {
        this.loggers.forEach((logger) => logger.log(level, message, meta))
    }
}

const logger = new CompositeLogger(
    new ConsoleLogger(env?.LOG_LEVEL),
    new FileLogger('/logs/app.log', env?.LOG_LEVEL)
)

export default logger
