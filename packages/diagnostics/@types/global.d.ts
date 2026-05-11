/// <reference types="vite/client" />

import type { TelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'
import type { TraceClient } from '@vtex/diagnostics-nodejs/dist/types/traces.js'
import type { LogClient } from '@vtex/diagnostics-nodejs/dist/types/logs.d.ts'

declare global {
  var fsDiagnostics: {
    TELEMETRY_CLIENT: TelemetryClient | undefined
    TRACE_CLIENT: TraceClient | undefined
    LOGGER_CLIENT: LogClient | undefined
    IS_DEV: boolean
    OTLP_TRACES_ENDPOINT: string
    OTLP_LOGGER_ENDPOINT: string
  }
}
