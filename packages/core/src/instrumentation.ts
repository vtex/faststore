import 'server-only'

const { name, version } = require('../package.json')
const { api } = require('../discovery.config')

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { getTelemetryClient } = await import('@faststore/diagnostics')

      return getTelemetryClient({
        name,
        version,
        account: api.storeId,
      })
    } catch (error) {
      console.error('Failed to initialize OTEL Instrumentation')
    }
  }
}
