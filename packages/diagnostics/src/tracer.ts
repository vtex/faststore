import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import * as grpc from '@grpc/grpc-js'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function traceExporter() {
  const OTLP_TRACES_ENDPOINT =
    globalThis.fsDiagnostics.OTLP_TRACES_ENDPOINT || 'localhost:4317'

  // let credentials = grpc.credentials.createSsl()
  let credentials = grpc.credentials.createInsecure()
  if (
    OTLP_TRACES_ENDPOINT.includes('localhost') ||
    OTLP_TRACES_ENDPOINT.includes('127.0.0.1') ||
    globalThis.fsDiagnostics.IS_DEV
  ) {
    credentials = grpc.credentials.createInsecure()
  }

  const collectorExporter = new OTLPTraceExporter({
    credentials,
    url: OTLP_TRACES_ENDPOINT,
    compression: 'gzip' as any,
  })

  return new BatchSpanProcessor(collectorExporter, {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30_000,
  })
}
