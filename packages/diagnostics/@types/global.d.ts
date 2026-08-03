/// <reference types="vite/client" />

import type { TelemetryClient } from '@vtex/diagnostics-nodejs/dist/telemetry/client.js'
import type { TraceClient } from '@vtex/diagnostics-nodejs/dist/types/traces.js'

declare global {
  var fsDiagnostics: {
    TELEMETRY_CLIENTS: Map<string, TelemetryClient | undefined>
    TRACE_CLIENTS: Map<string, TraceClient | undefined>
    IS_DEV: boolean
  }
}
