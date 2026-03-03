globalThis.fsDiagnostics ??= {
  IS_DEV: import.meta.env.DEV === true || process.env.NODE_ENV !== 'production',
  TELEMETRY_CLIENTS: new Map(),
  TRACE_CLIENTS: new Map(),
}
