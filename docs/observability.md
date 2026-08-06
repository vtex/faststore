# Observability

FastStore uses OpenTelemetry for server-side logs and traces, exported over OTLP
gRPC to VTEX collectors. The SDK is started by `@faststore/diagnostics` from the
Next.js instrumentation hook in `@faststore/core`.

## Enabling

Telemetry is **disabled by default**. Turn it on in the store's
`discovery.config.js`:

```js
analytics: {
  otelEnabled: true,
}
```

This single flag controls both SDK startup (`packages/core/src/instrumentation.ts`)
and whether resolvers emit spans (`OTEL_ENABLED` in the GraphQL context).

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
