export const logger = {
  log: (...args: any[]) => {
    process.env.DISCOVERY_DEBUG === 'true' ? console.log(...args) : undefined
  },
  error: console.error,
  info: console.info,
  warn: console.warn,
}
