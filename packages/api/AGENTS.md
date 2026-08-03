# AGENTS.md — `@faststore/api`

> Inherits from [`/AGENTS.md`](../../AGENTS.md) (root). This file adds context specific to `@faststore/api`.

## Purpose

`@faststore/api` is the **GraphQL BFF (Back For Front)** abstraction. It serves as the data layer for FastStore projects and exposes only GraphQL interfaces, handling platform-specific integrations (currently VTEX).

## Tech

- GraphQL 16.11.0 + GraphQL Codegen
- TypeScript 5.9.3 (strict)
- Envelop (GraphQL plugin system)
- Vitest for unit + integration tests

## Key Directories

- `src/typeDefs/` — `.graphql` files (type definitions, queries, mutations)
- `src/platforms/vtex/` — VTEX platform integration (most platform-specific code lives here)
- `src/directives/` — GraphQL directives (auth, caching)
- `src/observability/` — observability hooks
- `src/__generated__/` — generated GraphQL schema and types (DO NOT edit)

## Key Files

- `codegen.yml` — GraphQL codegen configuration
- `src/__generated__/schema.ts` — generated GraphQL schema
- `src/index.ts` — public entry point

## GraphQL Conventions

### Naming

| Element              | Pattern                                | Example                                 |
| -------------------- | -------------------------------------- | --------------------------------------- |
| Query/mutation names | camelCase                              | `validateCart`, `subscribeToNewsletter` |
| Schema types         | `Store{Entity}` prefix                 | `StoreProduct`, `StoreCart`             |
| Pagination types     | `{Entity}Connection` / `{Entity}Edge`  | `ProductConnection`, `ProductEdge`      |
| Input types          | `I{Entity}` prefix                     | `IStoreCart`, `IPersonNewsletter`       |

### Workflow

1. Edit `.graphql` type definitions in `src/typeDefs/`.
2. Run `pnpm generate:schema` (in this package) to regenerate the schema.
3. Run `pnpm generate:codegen` (in `@faststore/core`) to regenerate consumer types.
4. Check `@generated/` and `src/__generated__/` for new types — do not commit raw query strings without running these steps.

### Persisted documents

Query IDs are cached by `@faststore/cli`. The CLI MUST be built before `@faststore/api`'s `generate` step runs (enforced by `turbo.json`).

## Build Pipeline

- `@faststore/api#build` depends on its own `generate` step (`turbo.json`).
- Built output is dual ESM/CJS via conditional `exports`.

## Tests

```bash
cd packages/api
pnpm test:unit    # unit tests
pnpm test:int     # integration tests
```

Unit tests verify resolvers and utilities in isolation. Integration tests exercise the full schema against fixtures/mocks.

## Platform Integration

- Most code is platform-agnostic.
- Platform-specific code lives in `src/platforms/vtex/`.
- New platforms (if added) should mirror the `vtex/` directory structure.

## Generated Files (DO NOT EDIT)

- `src/__generated__/` — schema and types
- `dist/` — build outputs

## Public Surface

`@faststore/api` MUST validate session/customer input on the server side before propagating to platform calls. Modifications to authentication, authorization or CSRF mechanisms require explicit approval — see root [Security & Data Handling](../../AGENTS.md).
