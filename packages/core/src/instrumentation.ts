import pkgJSON from '../package.json'
import config from '../discovery.config'

export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    config.analytics.otelEnabled === true
  ) {
    const { name, version } = pkgJSON
    try {
      const { getTelemetryClient } = await import('@faststore/diagnostics')

      return getTelemetryClient({
        name: config.analytics?.serviceName ?? name,
        version,
        account: config.api.storeId,
      })
    } catch (error) {
      console.error('Failed to initialize OTEL Instrumentation')
    }
  }
}
