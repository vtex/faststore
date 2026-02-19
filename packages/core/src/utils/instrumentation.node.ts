import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { Exporters } from '@vtex/diagnostics-nodejs'

const OTLP_ENDPOINT = process.env.OTLP_ENDPOINT || 'localhost:4317'
console.log('OTLP_ENDPOINT: ' + OTLP_ENDPOINT)

export async function Init() {
  const tracesConfig = Exporters.CreateTracesExporterConfig({
    endpoint: OTLP_ENDPOINT,
    insecure: true,
    // interval, timeoutSeconds não são usados para gRPC
  })
  const tracesExporter = Exporters.CreateExporter(tracesConfig, 'otlp')
  await tracesExporter.initialize()

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: '@faststore/core',
    }),
    // spanProcessor: new SimpleSpanProcessor(tracesExporter.traceExporter()),
    spanProcessor: new SimpleSpanProcessor(
      new OTLPTraceExporter({
        // url: OTLP_ENDPOINT,
      })
    ),
    instrumentations: [getNodeAutoInstrumentations()],
  })
  sdk.start()
}

// import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
// import { Exporters, NewTelemetryClient } from '@vtex/diagnostics-nodejs';
// import { name, version } from '../../package.json' with { type: 'json' };

// const SERVICE_NAME = name;
// const APPLICATION_ID = name;
// const OTLP_ENDPOINT = process.env.OTLP_ENDPOINT || 'localhost:4317';

// async function setupTracesExporter() {
//   const tracesConfig = Exporters.CreateTracesExporterConfig({
//     endpoint: OTLP_ENDPOINT,
//     insecure: true,
//     // interval, timeoutSeconds não são usados para gRPC
//   });
//   const tracesExporter = Exporters.CreateExporter(tracesConfig, 'otlp');
//   await tracesExporter.initialize();
//   return tracesExporter;
// }

// export let CLIENT;
// export async function Init() {
//   CLIENT = await NewTelemetryClient(
//     APPLICATION_ID,
//     SERVICE_NAME,
//     SERVICE_NAME,
//     {
//       additionalAttrs: {
//         [ATTR_SERVICE_NAME]: name, [ATTR_SERVICE_VERSION]: version,
//         'environment': process.env.NODE_ENV ?? 'development'
//       }
//     }
//   )
//   const tracesExporter = await setupTracesExporter();
//   CLIENT.newTracesClient({
//     exporter: tracesExporter
//   });
//   console.log("Traces client configured successfully");

//   return CLIENT;
// }

// async function shutdownClient(client, name = 'client') {
//   if (client && client.shutdown) {
//     console.log(`Shutting down OTEL ${name} client...`);
//     try {
//       await client.shutdown();
//       console.log(`${name} OTEL client shutdown completed`);
//     } catch (error) {
//       console.error(`Error during ${name} OTEL client shutdown:`, error);
//     }
//   }
// }
