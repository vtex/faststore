import {
  CreateTracesExporterConfig,
  CreateExporter,
} from '@vtex/diagnostics-nodejs/dist/exporters/index.js'
import { NewTelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import resolvePackage from 'resolve-pkg'

import { name as currentPkgName } from '../package.json' with { type: 'json' }

async function setupTracesExporter() {
  const OTLP_TRACES_ENDPOINT =
    process.env.OTLP_TRACES_ENDPOINT || 'localhost:4317'

  const tracesConfig = CreateTracesExporterConfig({
    endpoint: OTLP_TRACES_ENDPOINT,
    insecure: global.fsDiagnostics.IS_DEV ?? false,
  })

  const tracesExporter = CreateExporter(tracesConfig, 'otlp')
  await tracesExporter.initialize()
  return tracesExporter
}

export async function getTelemetryClient(opt: {
  serviceName: string
  version: string
  clientName: string
  account: string
  packageName: string
}) {
  if (global.fsDiagnostics.TELEMETRY_CLIENTS.has(opt.packageName))
    return global.fsDiagnostics.TELEMETRY_CLIENTS.get(opt.packageName)

  const client = await NewTelemetryClient(
    currentPkgName,
    opt.clientName,
    opt.serviceName,
    {
      additionalAttrs: {
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

  const tracesExporter = await setupTracesExporter()
  // const logger = await client.newLogsClient()
  // const metrics = await client.newMetricsClient()

  global.fsDiagnostics.TRACE_CLIENTS.set(
    opt.packageName,
    await client.newTracesClient({
      setGlobalProvider: true,
      exporter: tracesExporter,
    })
  )

  // await logger.shutdown()
  // await metrics.shutdown()

  client.registerInstrumentations([new HttpInstrumentation()])

  // if (global.fsDiagnostics.IS_DEV)
  console.log('TELEMETRY CLIENT STARTED', opt)

  global.fsDiagnostics.TELEMETRY_CLIENTS.set(opt.packageName, client)
  return client
}

export function getTraceClient(serviceName: string) {
  return global.fsDiagnostics.TRACE_CLIENTS.get(serviceName)
}
