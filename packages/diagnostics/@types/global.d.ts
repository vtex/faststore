import type { NodeSDK } from '@opentelemetry/sdk-node'
import type { LoggerProvider } from '@opentelemetry/sdk-logs'

declare global {
  var fsDiagnostics: {
    TELEMETRY_CLIENT: NodeSDK | undefined
    LOGGER_CLIENT: LoggerProvider | undefined
    IS_DEV: boolean
    OTLP_TRACES_ENDPOINT: string
    OTLP_LOGGER_ENDPOINT: string
  }
}
