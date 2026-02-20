import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import {
  Exporters,
  Instrumentation,
  NewTelemetryClient,
} from '@vtex/diagnostics-nodejs'

import { name } from '../package.json' with { type: 'json' }

const SERVICE_NAME = name
const APPLICATION_ID = name
const OTLP_ENDPOINT = process.env.OTLP_ENDPOINT || 'localhost:4317'

async function setupTracesExporter() {
  const tracesConfig = Exporters.CreateTracesExporterConfig({
    endpoint: OTLP_ENDPOINT,
    insecure: globalThis.fsDiagnostics.IS_DEV ?? false,
  })

  const tracesExporter = Exporters.CreateExporter(tracesConfig, 'otlp')
  await tracesExporter.initialize()
  return tracesExporter
}

export async function getTelemetryClient(opt: {
  name: string
  version: string
  account: string
}) {
  if (globalThis.fsDiagnostics.TELEMETRY_CLIENTS.has(opt.name))
    return globalThis.fsDiagnostics.TELEMETRY_CLIENTS.get(opt.name)

  const client = await NewTelemetryClient(
    APPLICATION_ID,
    SERVICE_NAME,
    'faststore-proxy',
    {
      additionalAttrs: {
        [ATTR_SERVICE_NAME]: opt.name,
        [ATTR_SERVICE_VERSION]: opt.version,
        environment: process.env.NODE_ENV ?? 'development',
        ACCOUNT: opt.account ?? 'unknown',
      },
      debug: globalThis.fsDiagnostics.IS_DEV,
      config: {
        configPath: require.resolve('@faststore/diagnostics/config'),
      },
    }
  )
  const tracesExporter = await setupTracesExporter()
  await client.newLogsClient()
  await client.newMetricsClient()
  globalThis.fsDiagnostics.TRACE_CLIENTS.set(
    opt.name,
    await client.newTracesClient({
      exporter: tracesExporter,
    })
  )

  client.registerInstrumentations([new Instrumentation.HttpInstrumentation()])

  globalThis.fsDiagnostics.TELEMETRY_CLIENTS.set(opt.name, client)
  if (globalThis.fsDiagnostics.IS_DEV)
    console.log('TELEMETRY CLIENT STARTED', opt)

  return client
}

export function getTraceClient(name: string) {
  return globalThis.fsDiagnostics.TRACE_CLIENTS.get(name)
}
