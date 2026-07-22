/**
 * Disabling telemetry instantiation
 */

// import config from '../discovery.config'
// import pkgJSON from '../package.json'

// export async function register() {
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     const { name, version } = pkgJSON
//     try {
//       const { getTelemetryClient } = await import('@faststore/diagnostics')
//       console.log('Instrumentation.ts: Getting telemetry client')

//       return getTelemetryClient({
//         serviceName: config.analytics?.serviceName ?? name,
//         version,
//         account: config.api.storeId,
//         clientName: config.api.storeId,
//         packageName: name,
//       })
//     } catch (error) {
//       console.error('Failed to initialize OTEL Instrumentation')
//     }
//   }
// }

