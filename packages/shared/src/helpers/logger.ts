import chalk from 'chalk'

const DEFAULTS = {
  verbose: false,
  silent: true
}

class Logger {

  actor: string
  color: string

  constructor(actor: string, color = 'white') {
    this.actor = actor
    this.color = color
  }

  info(msg: string): void {
    if (!DEFAULTS.verbose) return
    this.log(msg, '️  ', 'white')
  }

  success(msg: string): void {
    this.log(msg, '✅', 'green')
  }

  warn(msg: string): void {
    this.log(msg, '⚠️ ', 'yellow')
  }

  error(msg: string): void {
    this.log(msg, '🚨', 'red')
  }

  log(msg: string, emoji: string, color = 'white'): void {
    if (DEFAULTS.silent) return
    let formattedMessage = chalk.keyword(color)(`${emoji}  ${this._stringify(msg)}`)
    if (DEFAULTS.verbose) {
      const formatedPrefix = chalk.keyword(this.color)(`[${this.actor}]`)
      formattedMessage = `${formatedPrefix} ${formattedMessage}`
    }
    console.error(formattedMessage)
  }

  _stringify(obj: any): string {
    return (typeof obj === 'object') ? JSON.stringify(obj) : obj.toString()
  }
}

const LoggerConstructor = (actor: string, color: string) => new Logger(actor, color)

export default LoggerConstructor

export { LoggerConstructor as Logger }

export const setDefaults = (silent: boolean, verbose: boolean): void => {
  DEFAULTS.silent = silent
  DEFAULTS.verbose = verbose
}
