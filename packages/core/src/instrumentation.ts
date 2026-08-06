import config from '../discovery.config'
import pkgJSON from '../package.json'

/**
 * Next.js instrumentation hook. This is the only place telemetry is booted, so
 * the OTel SDK is registered before any request is served.
 */
export async function register() {
  // Disabled feature until release date
  const instrumentationEnabled = false

  // The runtime check must wrap the import instead of guarding with an early
  // return: bundlers replace `process.env.NEXT_RUNTIME` with a literal, so only
  // a positive branch gets dropped from the edge bundle. Left reachable, the
  // OTel SDK pulls in Node builtins (`fs`, `zlib`, `stream`) that fail to resolve.
  if (process.env.NEXT_RUNTIME === 'nodejs' && instrumentationEnabled) {
    const { name, version } = pkgJSON

    try {
      const { getTelemetryClient } = await import('@faststore/diagnostics')

      return await getTelemetryClient({
        serviceName: config.analytics?.serviceName ?? name,
        version,
        account: config.api.storeId,
        clientName: config.api.storeId,
        packageName: name,
      })
    } catch (error) {
      console.error('Failed to initialize OTEL Instrumentation', error)
    }
  }
}
