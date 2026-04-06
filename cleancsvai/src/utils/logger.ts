type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: number
  data?: any
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 100

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      data
    }

    this.logs.push(entry)
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (process.env.NODE_ENV === 'development') {
      console[level === 'debug' ? 'log' : level](`[${level.toUpperCase()}] ${message}`, data || '')
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, data?: any) {
    this.log('error', message, data)
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()
