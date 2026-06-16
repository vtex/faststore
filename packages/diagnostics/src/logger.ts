import type { Resource } from '@opentelemetry/resources'

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { credentials } from '@grpc/grpc-js'
import { type Logger, SeverityNumber, logs } from '@opentelemetry/api-logs'
import { format } from 'node:util'

export function getLoggerExporter() {
  const OTLP_LOGGER_ENDPOINT =
    globalThis.fsDiagnostics.OTLP_LOGGER_ENDPOINT || 'localhost:4317'

  // let c = credentials.createSsl()
  let c = credentials.createInsecure()
  if (
    OTLP_LOGGER_ENDPOINT.includes('localhost') ||
    OTLP_LOGGER_ENDPOINT.includes('127.0.0.1') ||
    globalThis.fsDiagnostics.IS_DEV
  ) {
    c = credentials.createInsecure()
  }

  return new BatchLogRecordProcessor(
    new OTLPLogExporter({
      credentials: c,
      url: OTLP_LOGGER_ENDPOINT,
    })
  )
}

export function setupLogs(resource: Resource): LoggerProvider {
  if (globalThis.fsDiagnostics.LOGGER_CLIENT)
    return globalThis.fsDiagnostics.LOGGER_CLIENT

  const loggerProvider = new LoggerProvider({
    resource,
    processors: [getLoggerExporter()],
  })

  logs.setGlobalLoggerProvider(loggerProvider)

  globalThis.fsDiagnostics.LOGGER_CLIENT ??= loggerProvider

  return loggerProvider
}

export function getOTELLogger(name = 'faststore') {
  return globalThis.fsDiagnostics.LOGGER_CLIENT?.getLogger(name)
}

const CONSOLE_SEVERITY = {
  error: { number: SeverityNumber.ERROR, text: 'ERROR' },
  warn: { number: SeverityNumber.WARN, text: 'WARN' },
  info: { number: SeverityNumber.INFO, text: 'INFO' },
  debug: { number: SeverityNumber.DEBUG, text: 'DEBUG' },
} as const

export function logger(client?: Logger | undefined) {
  return (severity: keyof typeof CONSOLE_SEVERITY, ...args: unknown[]) => {
    if (!client)
      console.info(
        'OTEL logger is disabled. No logs will be sent to OTEL backend.'
      )

    client?.emit({
      severityNumber: CONSOLE_SEVERITY[severity].number,
      severityText: CONSOLE_SEVERITY[severity].text,
      body: format(args),
    })
  }
}
