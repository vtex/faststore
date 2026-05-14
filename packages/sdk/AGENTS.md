# AGENTS.md — `@faststore/sdk`

> Inherits from [`/AGENTS.md`](../../AGENTS.md) (root). This file adds context specific to `@faststore/sdk`.

## Purpose

`@faststore/sdk` provides **framework-agnostic business rules and state management**. It is consumed by `@faststore/core` and other framework-specific layers, but MUST itself remain free of framework dependencies.

## Bundle Budget (NON-NEGOTIABLE)

- Prefer zero-dependency solutions.
- Use the `pnpm size` Turbo task to verify budget before merging.
- New runtime dependencies require bundle review (see root Dependency Discipline).

## Key Modules

- `analytics/` — event sending (`sendAnalyticsEvent`, `useAnalyticsEvent`, `wrap.ts`, `events/`)
- `cart/` — cart management
- `search/` — search state and queries
- `session/` — session management
- `ui/` — UI state primitives (modals, drawers, etc — still framework-agnostic at this layer)
- `store/` — store creation primitives (`base.ts`, `composed.ts`, `optimistic.ts`, `persisted.ts`, `singleton.ts`)
- `utils/` — shared utilities
- `types.ts` — public type exports

## SDK Conventions

| Concept         | Pattern               | Example                                      |
| --------------- | --------------------- | -------------------------------------------- |
| Hook factories  | `use{Feature}`        | `useCart`, `useGlobalUIState`                |
| Store creators  | `create{Entity}Store` | `createCartStore`                            |
| Store modifiers | descriptive camelCase | `optimistic()`, `persisted()`, `singleton()` |

## Tests

```bash
cd packages/sdk
pnpm vitest run                  # all tests
pnpm vitest run test/hooks.test.ts   # single test file
```

`@faststore/sdk` MUST maintain >90% test coverage for all business logic (see root [Architectural Principles §VI](../../AGENTS.md)).

## Build Output

Dual ESM/CJS via conditional `exports`:

- ESM: `dist/es/index.mjs`
- CJS: `dist/cjs/index.js`
- Types: `dist/typings/`

Internal helpers are NOT re-exported from the public entry. If you add a new module, only re-export what truly belongs to the public API surface.

## When NOT to add code in @faststore/sdk

- Store-specific logic that belongs in `@faststore/core` overrides.
