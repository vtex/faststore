import './globals'
import * as OTEL_API from '@opentelemetry/api'
import * as OTEL_CONVENTIONS from '@opentelemetry/semantic-conventions'
import { getTelemetryClient, getTraceClient } from './start'

export { getTelemetryClient, getTraceClient } from './start'

export const CONVENTIONS = {
  ...OTEL_CONVENTIONS,
}

export const OTELAPI = OTEL_API

export default {
  OTELAPI,
  CONVENTIONS,
  getTelemetryClient,
  getTraceClient,
}
