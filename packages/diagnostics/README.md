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

`@faststore/diagnostics` initializes OpenTelemetry tracing, logging, and metrics for FastStore server-side instrumentation. It is a thin wrapper around `@vtex/diagnostics-nodejs` and is consumed by `@faststore/core` via Next.js instrumentation when telemetry is enabled.

## Package structure

```
src/
├── globals.ts    # Initializes the global fsDiagnostics state (telemetry client map, IS_DEV flag)
├── start.ts      # getTelemetryClient() and getTraceClient() implementations
└── index.ts      # Public exports
configs/
├── dev.json      # Telemetry client config for development
└── prod.json     # Telemetry client config for production
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

This initializes traces, logs, and metrics clients and registers HTTP instrumentation. Telemetry data is exported to an OTLP endpoint.

## Configuration

| Variable | Default | Description |
| :--- | :--- | :--- |
| `OTLP_TRACES_ENDPOINT` | `localhost:4317` | OTLP gRPC endpoint for trace export |
| `NODE_ENV` | — | `production` disables dev mode and uses `configs/prod.json` |

To enable telemetry in a store, set `analytics.otelEnabled: true` in `discovery.config.js`.

## How to develop

All logic lives in `src/start.ts` and `src/globals.ts`. To make changes:

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

- **Sampling config (dev):** [`configs/dev.json`](./configs/dev.json) — 100% sample rate
- **Sampling config (prod):** [`configs/prod.json`](./configs/prod.json) — 1% default, 30% for `trace_all`
- **Upstream library:** [@vtex/diagnostics-nodejs](https://www.npmjs.com/package/@vtex/diagnostics-nodejs)
- **OpenTelemetry:** [opentelemetry.io](https://opentelemetry.io)
