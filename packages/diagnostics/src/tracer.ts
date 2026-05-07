import { Exporters } from '@vtex/diagnostics-nodejs'
import type { TelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'

async function setupTracesExporter() {
  const OTLP_TRACES_ENDPOINT =
    process.env.OTLP_TRACES_ENDPOINT || 'localhost:4317'

  const tracesConfig = Exporters.CreateTracesExporterConfig({
    endpoint: OTLP_TRACES_ENDPOINT,
    insecure: global.fsDiagnostics.IS_DEV ?? false,
  })

  const tracesExporter = Exporters.CreateExporter(tracesConfig, 'otlp')
  await tracesExporter.initialize()
  return tracesExporter
}

export async function getTracesClient(telemetryClient: TelemetryClient) {
  if (global.fsDiagnostics.TRACE_CLIENT)
    return global.fsDiagnostics.TRACE_CLIENT

  const tracesExporter = await setupTracesExporter()

  global.fsDiagnostics.TRACE_CLIENT ??= await telemetryClient.newTracesClient({
    setGlobalProvider: true,
    exporter: tracesExporter,
  })
}

export function getTraceClient(_?: string) {
  return global.fsDiagnostics.TRACE_CLIENT
}
