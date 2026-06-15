import type { Resource } from '@opentelemetry/resources'

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { credentials } from '@grpc/grpc-js'
import { type Logger, SeverityNumber, logs } from '@opentelemetry/api-logs'
import {
  ATTR_VTEX_ACCOUNT_NAME,
  ATTR_VTEX_APPLICATION_ID,
} from '@vtex/diagnostics-semconv'
import { format } from 'node:util'

export function setupLogs(
  resource: Resource,
  opt: { serviceName: string; account: string }
): LoggerProvider {
  if (globalThis.fsDiagnostics.LOGGER_CLIENT)
    return globalThis.fsDiagnostics.LOGGER_CLIENT

  const OTLP_LOGGER_ENDPOINT =
    globalThis.fsDiagnostics.OTLP_LOGGER_ENDPOINT || 'localhost:4317'

  let c = credentials.createSsl()
  if (
    OTLP_LOGGER_ENDPOINT.includes('localhost') ||
    OTLP_LOGGER_ENDPOINT.includes('127.0.0.1') ||
    globalThis.fsDiagnostics.IS_DEV
  ) {
    c = credentials.createInsecure()
  }

  const loggerProvider = new LoggerProvider({
    resource,
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          credentials: c,
          url: OTLP_LOGGER_ENDPOINT,
        })
      ),
    ],
  })

  logs.setGlobalLoggerProvider(loggerProvider)

  globalThis.fsDiagnostics.LOGGER_CLIENT ??= loggerProvider

  overrideConsole(loggerProvider.getLogger('@faststore/console'), opt)

  return loggerProvider
}

/**
 * Wraps `globalThis.console` in a Proxy so that every call to the standard
 * console methods is also emitted as an OpenTelemetry log record, while still
 * writing to the original console. The wrapping happens only once (guarded by
 * the `LOGGER_CLIENT` check in `setupLogs`).
 */
function overrideConsole(
  logger: Logger,
  opt: { serviceName: string; account: string }
) {
  // Console methods we forward to OpenTelemetry logs, mapped to the OTel severity.
  const CONSOLE_SEVERITY: Record<
    string,
    { number: SeverityNumber; text: string }
  > = {
    error: { number: SeverityNumber.ERROR, text: 'ERROR' },
    warn: { number: SeverityNumber.WARN, text: 'WARN' },
    info: { number: SeverityNumber.INFO, text: 'INFO' },
    debug: { number: SeverityNumber.DEBUG, text: 'DEBUG' },
  }

  const handler: ProxyHandler<Console> = {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver)

      if (
        typeof prop !== 'string' ||
        typeof original !== 'function' ||
        !(prop in CONSOLE_SEVERITY)
      ) {
        return original
      }

      const severity = CONSOLE_SEVERITY[prop]

      return (...args: unknown[]) => {
        try {
          logger.emit({
            severityNumber: severity.number,
            severityText: severity.text,
            body: format(...args),
            attributes: {
              [ATTR_VTEX_ACCOUNT_NAME]: opt.account,
              [ATTR_VTEX_APPLICATION_ID]: 'faststore',
              service: opt.serviceName,
            },
          })
        } catch {
          // Never let telemetry break application logging.
        }

        return Reflect.apply(original, target, args)
      }
    },
  }

  globalThis.console = new Proxy(globalThis.console, handler)
}
