<p align="center">
  <a href="https://faststore.dev">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore SDK
</h1>
<p align="center">
  <strong>
    Lightweight ecommerce state management library
  </strong>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@faststore/sdk">
    <img src="https://badge.fury.io/js/%40faststore%2Fsdk.svg" alt="npm version" />
  </a>
</p>

`@faststore/sdk` provides the core business logic and state management for FastStore storefronts. It is consumed by `@faststore/core` and covers five domains:

- **Analytics** — event types and dispatch utilities for ecommerce tracking
- **Cart** — cart state management
- **Search** — search state, facets, pagination, and serialization
- **Session** — user session state
- **UI** — global UI state (minicart visibility, modals, drawers, etc.)

## Package structure

```
src/
├── analytics/   # Event types, sendAnalyticsEvent, useAnalyticsEvent
├── cart/        # Cart state and hooks
├── search/      # Search state, facets, pagination, serializer
├── session/     # Session state and provider
├── ui/          # Global UI state (useGlobalUIState, Provider)
├── store/       # Reactive store primitives (base, optimistic, persisted, etc.)
├── utils/       # Shared utilities
├── types.ts     # Shared TypeScript types
└── index.ts     # Public exports
```

## How to run

### Prerequisites

- Node.js ≥ 20
- pnpm

### Local setup

```bash
# 1. Install dependencies (from the repo root)
pnpm install

# 2. Start the build in watch mode
pnpm dev
```

## How to develop

Each domain lives in its own directory under `src/`. When adding or modifying logic:

1. Edit the relevant module in `src/{domain}/`
2. Export new symbols from `src/index.ts` if they are part of the public API
3. Run `pnpm test` to verify nothing broke
4. Run `pnpm size` to check the bundle size stays within the 10 KB limit

## How to test

```bash
pnpm test
```

## How to publish

Versioning and publishing are managed at the monorepo root by Lerna. Do not publish this package independently. Refer to the [Contributing guidelines](../../CONTRIBUTING.MD) for the full release workflow.

## Docs

- **SDK reference:** [developers.vtex.com/docs/guides/faststore/sdk-overview](https://developers.vtex.com/docs/guides/faststore/sdk-overview)
