import { Exporters } from '@vtex/diagnostics-nodejs'
import type { TelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'
import type { LogClient } from '@vtex/diagnostics-nodejs/dist/types/logs.js'
import {
  ATTR_VTEX_ACCOUNT_NAME,
  ATTR_VTEX_APPLICATION_ID,
} from '@vtex/diagnostics-semconv'
import { format } from 'node:util'

async function setupLogsExporter() {
  const OTLP_LOGGER_ENDPOINT =
    process.env.OTLP_LOGGER_ENDPOINT || 'localhost:4317'

  const logsExporter = Exporters.CreateExporter(
    Exporters.CreateLogsExporterConfig({
      endpoint: OTLP_LOGGER_ENDPOINT,
      insecure: global.fsDiagnostics.IS_DEV ?? false,
    }),
    'otlp'
  )

  await logsExporter.initialize()

  return logsExporter
}

export async function getLogger(
  client: TelemetryClient,
  opt: { serviceName: string; client: string }
) {
  if (global.fsDiagnostics.LOGGER_CLIENT)
    return global.fsDiagnostics.LOGGER_CLIENT

  const logger = await client.newLogsClient({
    exporter: await setupLogsExporter(),
  })

  overrideConsole(logger, opt)

  global.fsDiagnostics.LOGGER_CLIENT ??= logger

  return logger
}

function overrideConsole(
  logger: LogClient,
  opt: { serviceName: string; client: string }
) {
  const handler: ProxyHandler<Console> = {
    get(target: Console, prop: keyof Console) {
      switch (true) {
        case prop === 'info':
        case prop === 'error':
        case prop === 'debug': {
          const original = target[prop]
          return (...args: unknown[]) => {
            const str = format(`[%s]: %s`, prop, format(...args))
            logger[prop](str, {
              [ATTR_VTEX_ACCOUNT_NAME]: opt.client,
              [ATTR_VTEX_APPLICATION_ID]: 'faststore',
              service: opt.serviceName,
            })

            original(str)
          }
        }
        case prop === 'warn':
        case prop === 'log': {
          const original = target[prop]
          return (...args: unknown[]) => {
            const str = format(`[%s]: %s`, prop, format(...args))
            logger.debug(str, {
              [ATTR_VTEX_ACCOUNT_NAME]: opt.client,
              [ATTR_VTEX_APPLICATION_ID]: 'faststore',
              service: opt.serviceName,
            })
            original(str)
          }
        }
        default:
          return target[prop]
      }
    },
  }

  globalThis.console = new Proxy(globalThis.console, handler)
}
