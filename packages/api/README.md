<p align="center">
  <a href="https://faststore.dev">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore API
</h1>
<p align="center">
  <strong>
    GraphQL API layer for FastStore storefronts
  </strong>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@faststore/api">
    <img src="https://badge.fury.io/js/%40faststore%2Fapi.svg" alt="npm version" />
  </a>
</p>


`@faststore/api` owns the GraphQL schema, resolvers, directives, and platform integration for FastStore storefronts. It defines the data contract between the storefront and e-commerce backends — currently the VTEX platform.

This package is consumed internally by `@faststore/core`. You will work here when adding or modifying GraphQL queries, mutations, resolvers, or types.

## Package structure

```
src/
├── platforms/
│   └── vtex/
│       ├── resolvers/   # GraphQL resolvers (query.ts, mutation.ts, product.ts, etc.)
│       ├── typeDefs/    # GraphQL schema definitions (.graphql files)
│       ├── clients/     # VTEX API clients
│       ├── loaders/     # DataLoader instances for batching
│       └── utils/       # Platform utilities
├── directives/          # Custom GraphQL directives (auth, cacheControl)
├── observability/       # OpenTelemetry tracing
└── index.ts             # Public exports
```

## How to run

### Prerequisites

- Node.js ≥ 20
- Access to a VTEX account (the local dev server defaults to the `storeframework` account)

### Local setup

```bash
# 1. Install dependencies (from the repo root)
pnpm install

# 2. Start the local GraphQL server with file watching
pnpm dev
```

This runs the build in watch mode and starts a local GraphQL server at `http://localhost:4000/graphql`. You can use it to run queries and test changes directly.

## How to use

`@faststore/api` is consumed as an npm package by `@faststore/core`, which sets up the full GraphQL layer.

## How to develop

### Adding or modifying a resolver

1. Edit or create the resolver file in `src/platforms/vtex/resolvers/`
2. If adding a new type, create the corresponding `.graphql` file in `src/platforms/vtex/typeDefs/`
3. Run `pnpm generate` to regenerate TypeScript types from the updated schema
4. Run `pnpm test` to verify nothing broke

### Modifying the GraphQL schema

After editing any `.graphql` file in `typeDefs/`, always regenerate the schema types:

```bash
pnpm generate
```

> The generated output lives in `src/__generated__/` — do not edit those files manually.

## How to test

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:int

# All tests
pnpm test
```

## How to publish

Versioning and publishing are managed at the monorepo root by Lerna. Do not publish this package independently. Refer to the [Contributing guidelines](../../CONTRIBUTING.MD) for the full release workflow.

## Docs

- **FastStore API reference:** [developers.vtex.com/docs/guides/faststore/faststore-api](https://developers.vtex.com/docs/guides/faststore/faststore-api)
- **GraphQL schema:** [`src/platforms/vtex/typeDefs/`](./src/platforms/vtex/typeDefs/)
