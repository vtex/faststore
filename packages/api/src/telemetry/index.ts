import {
  BasicTracerProvider,
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base'
import { Resource } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from '@opentelemetry/sdk-logs'
import { OTLPLogsExporter } from '@opentelemetry/exporter-logs-otlp-grpc'

import type { Options } from '../'
import { getFastStoreTelemetryPlugin } from './useFastStoreTelemetry'
import packageJson from '../../package.json'

export type GetTelemetryOptions = {
  mode?: 'verbose'
  experimentalSendLogs?: boolean
}

const FASTSTORE_API_VERSION = packageJson.version

export function getTelemetry(
  APIOptions: Options,
  telemetryOptions?: GetTelemetryOptions
) {
  const honeycombCollectorOptions = {
    // url is optional and can be omitted - default is http://localhost:4317
    url: 'opentelemetry-collector-beta.vtex.systems',
  }

  const openSearchCollectorOptions = {
    // url is optional and can be omitted - default is http://localhost:4317
    url: 'https://developer-logs.opentelemetry-collector.vtex.systems',
  }

  // Create a new tracer provider
  const tracerProvider = new BasicTracerProvider({
    resource: new Resource({
      'service.name': 'faststore-api',
      'service.version': FASTSTORE_API_VERSION,
      'service.name_and_version': `faststore-api@${FASTSTORE_API_VERSION}`,
      platform: APIOptions.platform,
      [`${APIOptions.platform}.account`]: APIOptions.account,
      [`${APIOptions.platform}.environment`]: APIOptions.environment,
      // TODO: include the following properties in the logs
      // [`${APIOptions.platform}.options.hideUnavailableItems`]:
      //   APIOptions.hideUnavailableItems,
      // [`${APIOptions.platform}.flags.enableOrderFormSync`]:
      //   APIOptions.flags?.enableOrderFormSync,
      // channel: APIOptions.channel,
      locale: APIOptions.locale,
    }),
  })

  const loggerProvider = new LoggerProvider()

  // Create trace exporter
  const honeycombExporter = new OTLPTraceExporter(honeycombCollectorOptions)

  // Create log exporter
  const openSearchExporter = new OTLPLogsExporter(openSearchCollectorOptions)

  // Set up a span processor to export spans to Honeycomb
  const honeyCombSpanProcessor = new SimpleSpanProcessor(honeycombExporter)

  // Set up a log record processor to export spans to OpenSearch
  const openSearchLogProcessor = new SimpleLogRecordProcessor(
    openSearchExporter
  )

  // Register the span processor with the tracer provider
  tracerProvider.addSpanProcessor(honeyCombSpanProcessor)

  // Register the log record processor with the log provider
  loggerProvider.addLogRecordProcessor(openSearchLogProcessor)

  if (telemetryOptions?.mode === 'verbose') {
    // Set up a console exporter for verbose mode
    const consoleExporter = new ConsoleSpanExporter()
    const verboseTraceProcessor = new SimpleSpanProcessor(consoleExporter)

    // Set up processors for verbose mode
    const consoleLogExporter = new ConsoleLogRecordExporter()
    const veboseLogRecordExporter = new SimpleLogRecordProcessor(
      consoleLogExporter
    )

    tracerProvider.addSpanProcessor(verboseTraceProcessor)
    loggerProvider.addLogRecordProcessor(veboseLogRecordExporter)
  }

  const useFaststoreTelemetry = getFastStoreTelemetryPlugin(
    // The @opentelemetry/sdk-trace-base was renamed from @opentelemetry/tracing but the
    // envelop plugin doesn't support this change yet. This causes the class type to be incompatible,
    // even if they are the same. https://github.com/n1ru4l/envelop/issues/1610
    tracerProvider as any,
    loggerProvider,
    'faststore-api',
    telemetryOptions?.experimentalSendLogs ?? false
  )

  return { useFaststoreTelemetry }
}
