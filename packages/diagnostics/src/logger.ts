import { SeverityNumber, logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { format } from 'node:util'
import { createChannelCredentials } from './credentials'

export function getLoggerExporter() {
  const endpoint = globalThis.fsDiagnostics.OTLP_LOGGER_ENDPOINT

  return new BatchLogRecordProcessor(
    new OTLPLogExporter({
      credentials: createChannelCredentials(endpoint),
      url: endpoint,
    })
  )
}

const SEVERITY = {
  error: { number: SeverityNumber.ERROR, text: 'ERROR' },
  warn: { number: SeverityNumber.WARN, text: 'WARN' },
  info: { number: SeverityNumber.INFO, text: 'INFO' },
  debug: { number: SeverityNumber.DEBUG, text: 'DEBUG' },
} as const

export type LogSeverity = keyof typeof SEVERITY

/**
 * Builds a `util.format`-style emitter for the given instrumentation scope.
 *
 * The underlying provider is resolved on every call because callers hold these
 * emitters in module-level constants, which are evaluated before
 * `getTelemetryClient` installs the provider. Formatting is deferred until a
 * provider exists so disabled telemetry costs nothing on hot paths — pass
 * printf-style arguments rather than pre-built template strings.
 */
export function logger(name: string) {
  return (severity: LogSeverity, ...args: unknown[]) => {
    if (!globalThis.fsDiagnostics.TELEMETRY_CLIENT) {
      return
    }

    logs.getLogger(name).emit({
      severityNumber: SEVERITY[severity].number,
      severityText: SEVERITY[severity].text,
      body: format(...args),
    })
  }
}
