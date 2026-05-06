globalThis.fsDiagnostics ??= {
  IS_DEV: import.meta.env.DEV === true || process.env.NODE_ENV !== 'production',
  TELEMETRY_CLIENT: undefined,
  TRACE_CLIENT: undefined,
  LOGGER_CLIENT: undefined,
}
