import type { NodeSDK } from '@opentelemetry/sdk-node'

declare global {
  var fsDiagnostics: {
    TELEMETRY_CLIENT: NodeSDK | undefined
    IS_DEV: boolean
    OTLP_TRACES_ENDPOINT: string
    OTLP_LOGGER_ENDPOINT: string
    OTLP_TRACES_SAMPLE_RATE: number
  }
}
