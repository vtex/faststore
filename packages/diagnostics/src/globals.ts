const isDev =
  import.meta.env.DEV === true || process.env.NODE_ENV !== 'production'

globalThis.fsDiagnostics ??= {
  IS_DEV: isDev,
  TELEMETRY_CLIENT: undefined,
  TRACE_CLIENT: undefined,
  LOGGER_CLIENT: undefined,
  OTLP_TRACES_ENDPOINT:
    'traces-grpc-faststore-pvl.opentelemetry-collector.vtex.systems:80',
  OTLP_LOGGER_ENDPOINT:
    'logs-developer-fluentd-faststore-pvl.opentelemetry-collector.vtex.systems',
}
