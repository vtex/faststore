import { NewTelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import resolvePackage from 'resolve-pkg'
import { ATTR_VTEX_ACCOUNT_NAME } from '@vtex/diagnostics-semconv'

import { name as currentPkgName } from '../package.json' with { type: 'json' }
import { getTracesClient } from './tracer'
import { getLogger } from './logger'

export async function getTelemetryClient(opt: {
  serviceName: string
  version: string
  clientName: string
  account: string
  packageName: string
}) {
  if (global.fsDiagnostics.TELEMETRY_CLIENT)
    return global.fsDiagnostics.TELEMETRY_CLIENT

  const client = await NewTelemetryClient(
    currentPkgName,
    opt.clientName,
    opt.serviceName,
    {
      additionalAttrs: {
        [ATTR_VTEX_ACCOUNT_NAME]: opt.account ?? 'unknown',
        '@faststore_version': opt.version,
        '@faststore_package_name': opt.packageName,
        '@faststore_account_name': opt.account ?? 'unknown',
        '@faststore_environment': process.env.NODE_ENV ?? 'development',
      },
      // debug: global.fsDiagnostics.IS_DEV,
      config: {
        configPath: resolvePackage(
          `@faststore/diagnostics/configs/${global.fsDiagnostics.IS_DEV ? 'dev' : 'prod'}.json`,
          {
            cwd: process.env.PWD ?? process.cwd(),
          }
        ),
      },
    }
  )

  const { serviceName, account } = opt
  getLogger(client, { serviceName, client: account })
  getTracesClient(client)

  client.registerInstrumentations([new HttpInstrumentation()])

  if (global.fsDiagnostics.IS_DEV) console.log('TELEMETRY CLIENT STARTED', opt)

  global.fsDiagnostics.TELEMETRY_CLIENT ??= client

  return client
}
