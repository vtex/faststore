import './globals'
export * as OTELAPI from '@opentelemetry/api'
export { type LogSeverity, logger } from './logger'
export { getTelemetryClient, type TelemetryOptions } from './start'
