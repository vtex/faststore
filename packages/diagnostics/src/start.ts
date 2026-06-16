import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  ATTR_VTEX_ACCOUNT_NAME,
  ATTR_VTEX_APPLICATION_ID,
  ATTR_VTEX_DIAGNOSTICS_NAME,
} from '@vtex/diagnostics-semconv'
import { traceExporter } from './tracer'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { setupLogs } from './logger'

export async function getTelemetryClient(opt: {
  serviceName: string
  version: string
  clientName: string
  account: string
  packageName: string
}) {
  if (global.fsDiagnostics.TELEMETRY_CLIENT)
    return global.fsDiagnostics.TELEMETRY_CLIENT

  const resource = resourceFromAttributes({
    'service.name': opt.serviceName,
    'service.version': opt.version,
    [ATTR_VTEX_ACCOUNT_NAME]: opt.account ?? 'unknown',
    [ATTR_VTEX_APPLICATION_ID]: opt.serviceName,
    [ATTR_VTEX_DIAGNOSTICS_NAME]: 'faststore_custom',
    '@faststore_version': opt.version,
    '@faststore_package_name': opt.packageName,
    '@faststore_account_name': opt.account ?? 'unknown',
    '@faststore_environment': process.env.NODE_ENV ?? 'development',
  })

  const sdk = new NodeSDK({
    resource,
    spanProcessors: [traceExporter()],
    instrumentations: [new HttpInstrumentation()],
  })

  global.fsDiagnostics.TELEMETRY_CLIENT = sdk

  const logs = setupLogs(resource)

  sdk.start()

  if (global.fsDiagnostics.IS_DEV) console.log('TELEMETRY CLIENT STARTED', opt)

  process.on('SIGTERM', async () => {
    await logs.shutdown()

    sdk
      .shutdown()
      .then(() => console.log('OTel SDK shut down gracefully'))
      .catch((err) => console.error('Error shutting down OTel SDK', err))
      .finally(() => process.exit(0))
  })

  return sdk
}
