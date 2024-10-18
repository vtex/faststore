export const logger = {
  ...console,

  log: (...args: any[]) => {
    process.env.DISCOVERY_DEBUG === 'true' ? console.log(...args) : undefined
  },
}
