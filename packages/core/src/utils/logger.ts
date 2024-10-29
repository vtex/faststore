import pinoLogger, { Logger } from 'pino'

let logger: Logger
export const getLogger = () => {
  if (!logger) {
    // TODO: Define level by environment
    logger = pinoLogger({
      level: 'debug',
    })
  }
  return logger
}
