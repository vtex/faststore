import type { Resource } from '@opentelemetry/resources'

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { credentials } from '@grpc/grpc-js'
import { logs } from '@opentelemetry/api-logs'

export function setupLogs(resource: Resource): LoggerProvider {
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

  return loggerProvider
}
