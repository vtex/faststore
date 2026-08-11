import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import {
  BatchSpanProcessor,
  ParentBasedSampler,
  type Sampler,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-node'
import { createChannelCredentials } from './credentials'

/**
 * Payload compression follows the standard `OTEL_EXPORTER_OTLP_COMPRESSION`
 * environment variable (set it to `gzip` to reduce egress).
 */
export function traceExporter() {
  const endpoint = globalThis.fsDiagnostics.OTLP_TRACES_ENDPOINT

  const collectorExporter = new OTLPTraceExporter({
    credentials: createChannelCredentials(endpoint),
    url: endpoint,
  })

  return new BatchSpanProcessor(collectorExporter, {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30_000,
  })
}

/**
 * Development traces everything; elsewhere a ratio sampler keeps export volume
 * (and collector cost) bounded. Parent-based so a sampled request keeps all of
 * its child spans instead of producing partial traces.
 */
export function traceSampler(): Sampler {
  const ratio = globalThis.fsDiagnostics.IS_DEV
    ? 1
    : globalThis.fsDiagnostics.OTLP_TRACES_SAMPLE_RATE

  return new ParentBasedSampler({ root: new TraceIdRatioBasedSampler(ratio) })
}
