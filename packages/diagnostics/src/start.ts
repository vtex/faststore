import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import {
  CreateTracesExporterConfig,
  CreateExporter,
} from '@vtex/diagnostics-nodejs/dist/exporters/index.js'
import { NewTelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import resolvePackage from 'resolve-pkg'

import { name } from '../package.json' with { type: 'json' }

const APPLICATION_ID = name
const OTLP_ENDPOINT = process.env.OTLP_ENDPOINT || 'localhost:4317'

async function setupTracesExporter() {
  const tracesConfig = CreateTracesExporterConfig({
    endpoint: OTLP_ENDPOINT,
    insecure: globalThis.fsDiagnostics.IS_DEV ?? false,
  })

  const tracesExporter = CreateExporter(tracesConfig, 'otlp')
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

  const client = await NewTelemetryClient(APPLICATION_ID, opt.name, opt.name, {
    additionalAttrs: {
      [ATTR_SERVICE_NAME]: opt.name,
      [ATTR_SERVICE_VERSION]: opt.version,
      environment: process.env.NODE_ENV ?? 'development',
      ACCOUNT: opt.account ?? 'unknown',
    },
    // debug: globalThis.fsDiagnostics.IS_DEV,
    config: {
      configPath: resolvePackage(
        `@faststore/diagnostics/configs/${globalThis.fsDiagnostics.IS_DEV ? 'dev' : 'prod'}.json`,
        {
          cwd: process.env.PWD ?? process.cwd(),
        }
      ),
    },
  })
  const tracesExporter = await setupTracesExporter()
  await client.newLogsClient()
  await client.newMetricsClient()
  globalThis.fsDiagnostics.TRACE_CLIENTS.set(
    opt.name,
    await client.newTracesClient({
      exporter: tracesExporter,
    })
  )

  client.registerInstrumentations([new HttpInstrumentation()])

  globalThis.fsDiagnostics.TELEMETRY_CLIENTS.set(opt.name, client)
  if (globalThis.fsDiagnostics.IS_DEV)
    console.log('TELEMETRY CLIENT STARTED', opt)

  return client
}

export function getTraceClient(name: string) {
  return globalThis.fsDiagnostics.TRACE_CLIENTS.get(name)
}
