const DEFAULT_TRACES_ENDPOINT =
  'traces-grpc-faststore-pvl.opentelemetry-collector.vtex.systems:80'
const DEFAULT_LOGGER_ENDPOINT =
  'logs-developer-fluentd-faststore-pvl.opentelemetry-collector.vtex.systems'

/** Fraction of traces exported when telemetry is enabled outside development. */
const DEFAULT_TRACES_SAMPLE_RATE = 0.3

const parseSampleRate = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1
    ? parsed
    : fallback
}

globalThis.fsDiagnostics ??= {
  IS_DEV: process.env.NODE_ENV !== 'production',
  TELEMETRY_CLIENT: undefined,
  OTLP_TRACES_ENDPOINT:
    process.env.OTLP_TRACES_ENDPOINT || DEFAULT_TRACES_ENDPOINT,
  OTLP_LOGGER_ENDPOINT:
    process.env.OTLP_LOGGER_ENDPOINT || DEFAULT_LOGGER_ENDPOINT,
  OTLP_TRACES_SAMPLE_RATE: parseSampleRate(
    process.env.OTLP_TRACES_SAMPLE_RATE,
    DEFAULT_TRACES_SAMPLE_RATE
  ),
}
