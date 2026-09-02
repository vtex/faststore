import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getLoggerExporter } from './logger'
import { traceExporter, traceSampler } from './tracer'

export interface TelemetryOptions {
  serviceName: string
  version: string
  clientName: string
  account: string
  packageName: string
}

/**
 * Boots the OpenTelemetry SDK once per process and registers it globally, so
 * `logger()` and `OTELAPI.trace` pick it up. Repeat calls return the running
 * instance, which also keeps Next.js hot-module-reload from starting a second
 * exporter in development.
 */
export async function getTelemetryClient(opt: TelemetryOptions) {
  if (globalThis.fsDiagnostics.TELEMETRY_CLIENT) {
    return globalThis.fsDiagnostics.TELEMETRY_CLIENT
  }

  const resource = resourceFromAttributes({
    'service.name': opt.serviceName,
    'service.version': opt.version,
    'vtex.account.name': opt.account ?? 'unknown',
    'vtex.application.id': opt.serviceName,
    'vtex.diagnostics.name': 'faststore_custom',
    '@faststore_version': opt.version,
    '@faststore_package_name': opt.packageName,
    '@faststore_account_name': opt.account ?? 'unknown',
    '@faststore_environment': process.env.NODE_ENV ?? 'development',
  })

  // NodeSDK owns both pipelines: it installs the global tracer provider and,
  // via `logRecordProcessors`, the global logger provider that `logger()` reads.
  const sdk = new NodeSDK({
    resource,
    sampler: traceSampler(),
    spanProcessors: [traceExporter()],
    logRecordProcessors: [getLoggerExporter()],
    instrumentations: [new HttpInstrumentation(), new UndiciInstrumentation()],
  })

  sdk.start()
  globalThis.fsDiagnostics.TELEMETRY_CLIENT = sdk

  registerShutdownHook(sdk)

  if (globalThis.fsDiagnostics.IS_DEV) {
    console.log('TELEMETRY CLIENT STARTED', opt)
  }

  return sdk
}

/**
 * Flushes pending spans and logs on SIGTERM. Registering a listener suppresses
 * Node's default termination, so the signal is re-raised once the listener has
 * been removed instead of forcing `process.exit` on the host application.
 */
function registerShutdownHook(sdk: NodeSDK) {
  process.once('SIGTERM', () => {
    sdk
      .shutdown()
      .catch((error) => console.error('Error shutting down OTel SDK', error))
      .finally(() => process.kill(process.pid, 'SIGTERM'))
  })
}
