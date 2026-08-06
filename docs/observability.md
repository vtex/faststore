# Observability

FastStore uses OpenTelemetry for server-side logs and traces, exported over OTLP
gRPC to VTEX collectors. The SDK is started by `@faststore/diagnostics` from the
Next.js instrumentation hook in `@faststore/core`.

## Enabling

Telemetry is **off until the feature is released**. It is gated by two hardcoded
flags rather than by store configuration, so a store cannot turn it on:

| Flag | File | Controls |
| :--- | :--- | :--- |
| `instrumentationEnabled` | [`packages/core/src/instrumentation.ts`](../packages/core/src/instrumentation.ts) | Starting the OTel SDK, and therefore whether `logger()` emits anything |
| `OTEL_ENABLED` | [`packages/core/src/server/options.ts`](../packages/core/src/server/options.ts) | The per-request root span in `execute()` and the resolver spans from `@faststore/api` |

Flip both to `true` to exercise the pipeline locally. `logger()` is a no-op
until the SDK has started, so `OTEL_ENABLED` on its own emits neither traces nor
logs.

## Configuration

Endpoints and sampling default to the VTEX collectors and can be overridden with
environment variables — see
[`packages/diagnostics/src/globals.ts`](../packages/diagnostics/src/globals.ts):

| Variable | Description |
| :--- | :--- |
| `OTLP_TRACES_ENDPOINT` | OTLP gRPC endpoint for traces |
| `OTLP_LOGGER_ENDPOINT` | OTLP gRPC endpoint for logs |
| `OTLP_TRACES_SAMPLE_RATE` | Fraction of traces exported outside development (default `0.3`) |

To send logs to the development collector, set `OTLP_LOGGER_ENDPOINT` to
`developer-logs.opentelemetry-collector.vtex.systems:80`.

## Logs

Search in the [Grafana app](https://grafana.vtex.com/explore) by attribute:

- `vtex.account.name:<account>` — for example `vtex.account.name:storeframework`
- `vtex.application.id:faststore`

> Development logs are queried at `victoria-logs-developer`, production at `victoria-logs-main`.

## Traces

Connect to the VPN and open the [SigNoz app](https://signoz-traces.vtex.systems/home),
then search for traces carrying:

- `@faststore_account_name: <account>`
- `@faststore_environment: production` or `@faststore_environment: development`
