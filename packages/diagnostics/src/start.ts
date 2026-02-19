import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import {
  Exporters,
  Instrumentation,
  NewTelemetryClient,
} from '@vtex/diagnostics-nodejs'
import type { TelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'
import type { TraceClient } from '@vtex/diagnostics-nodejs/dist/types/traces.js'
import { name } from '../package.json' with { type: 'json' }

const SERVICE_NAME = name
const APPLICATION_ID = name
const OTLP_ENDPOINT = process.env.OTLP_ENDPOINT || 'localhost:4317'

export let TELEMETRY_CLIENT: TelemetryClient | undefined
export let TRACE_CLIENT: TraceClient | undefined

async function setupTracesExporter() {
  const tracesConfig = Exporters.CreateTracesExporterConfig({
    endpoint: OTLP_ENDPOINT,
    insecure: true,
  })

  const tracesExporter = Exporters.CreateExporter(tracesConfig, 'otlp')
  await tracesExporter.initialize()
  return tracesExporter
}

export async function getTelemetryClient(opt: {
  name: string
  version: string
}) {
  TELEMETRY_CLIENT = await NewTelemetryClient(
    APPLICATION_ID,
    SERVICE_NAME,
    'faststore-proxy',
    {
      additionalAttrs: {
        [ATTR_SERVICE_NAME]: opt.name,
        [ATTR_SERVICE_VERSION]: opt.version,
        environment: process.env.NODE_ENV ?? 'development',
      },
    }
  )
  const tracesExporter = await setupTracesExporter()
  await TELEMETRY_CLIENT.newLogsClient({ exporter: tracesExporter })
  await TELEMETRY_CLIENT.newMetricsClient({ exporter: tracesExporter })
  TRACE_CLIENT = await TELEMETRY_CLIENT.newTracesClient({
    exporter: tracesExporter,
  })

  TELEMETRY_CLIENT.registerInstrumentations(
    Instrumentation.CommonInstrumentations.minimal()
  )
  console.log('TELEMETRY CLIENT STARTED', opt)

  return TELEMETRY_CLIENT
}

export function getTraceClient() {
  return TRACE_CLIENT
}
