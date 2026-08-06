<p align="center">
  <a href="https://faststore.dev">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  Faststore Diagnostics
</h1>
<p align="center">
  <strong>
    OpenTelemetry tracing and telemetry for FastStore
  </strong>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@faststore/diagnostics">
    <img src="https://badge.fury.io/js/%40faststore%2Fdiagnostics.svg" alt="npm version" />
  </a>
</p>

`@faststore/diagnostics` initializes OpenTelemetry tracing, logging, and metrics for FastStore server-side instrumentation.

## Package structure

```text
src/
├── globals.ts     # Initializes the global fsDiagnostics state (endpoints, sample rate, IS_DEV flag)
├── credentials.ts # gRPC channel credentials shared by both exporters
├── tracer.ts      # Span processor and sampler
├── logger.ts      # Log record processor and the logger() emitter
├── start.ts       # getTelemetryClient() implementation
└── index.ts       # Public exports
```

## How it works

`@faststore/core` calls `getTelemetryClient()` at server startup via Next.js `instrumentation.ts`:

```ts
// packages/core/src/instrumentation.ts
import { getTelemetryClient } from '@faststore/diagnostics'

await getTelemetryClient({
  serviceName: config.analytics?.serviceName ?? name,
  version,
  account: config.api.storeId,
  clientName: config.api.storeId,
  packageName: name,
})
```

This starts a single `NodeSDK` per process, which registers the global tracer and logger providers and installs HTTP and Undici instrumentation. Telemetry is exported to an OTLP gRPC endpoint.

Application code emits logs through `logger()`, which resolves the provider on each call and is a no-op until the SDK has started:

```ts
import { logger } from '@faststore/diagnostics'

const log = logger('@faststore/core')

// printf-style: arguments are only formatted when telemetry is enabled
log('error', 'Request failed: %s', reason)
```

## Configuration

| Variable | Default | Description |
| :--- | :--- | :--- |
| `OTLP_TRACES_ENDPOINT` | VTEX traces collector | OTLP gRPC endpoint for trace export |
| `OTLP_LOGGER_ENDPOINT` | VTEX logs collector | OTLP gRPC endpoint for log export |
| `OTLP_TRACES_SAMPLE_RATE` | `0.3` | Fraction of traces exported outside development (development always samples everything) |
| `OTEL_EXPORTER_OTLP_COMPRESSION` | — | Set to `gzip` to compress exported payloads |
| `NODE_ENV` | — | Any value other than `production` enables dev mode |

Endpoints connect over plaintext gRPC unless the configured URL starts with `https://`.

To enable telemetry in a store, set `analytics.otelEnabled: true` in `discovery.config.js`.

## How to develop

To make changes:

1. Edit the relevant file in `src/`
2. Run `pnpm build` to compile
3. Verify via `@faststore/core` — since it's a workspace dependency, `instrumentation.ts` picks up your local build automatically

> Changes are validated by running `@faststore/core` with `analytics.otelEnabled: true` and checking that traces reach the configured OTLP endpoint.

## How to run

### Prerequisites

- Node.js ≥ 20
- pnpm

### Local setup

```bash
# 1. Install dependencies (from the repo root)
pnpm install

# 2. Build the package
pnpm build
```

## How to publish

Versioning and publishing are managed at the monorepo root by Lerna. Do not publish this package independently. Refer to the [Contributing guidelines](../../CONTRIBUTING.MD) for the full release workflow.

## Documentation

- **Observability runbook:** [`docs/observability.md`](../../docs/observability.md)
- **OpenTelemetry:** [opentelemetry.io](https://opentelemetry.io)
