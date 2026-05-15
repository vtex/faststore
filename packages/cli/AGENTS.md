# AGENTS.md — `@faststore/cli`

> Inherits from [`/AGENTS.md`](../../AGENTS.md) (root). This file adds context specific to `@faststore/cli`.

## Purpose

`@faststore/cli` is the **command-line tooling** for FastStore. It is an oclif-based CLI that generates types, caches GraphQL persisted documents, scaffolds projects, and orchestrates dev/build workflows for other packages.

## Tech

- oclif
- TypeScript 5.3 (strict)
- tsup for build (`tsup.config.ts`)
- Vitest

## Key Directories

- `bin/` — CLI entrypoint
- `src/commands/` — oclif commands (one file per command)
- `src/utils/` — shared utilities
- `src/__mocks__/` — mocks for tests
- `src/index.ts` — public entry

## Commands

Each file in `src/commands/` defines one oclif command:

- `build.ts` — production build orchestration
- `dev.ts` — development server
- `start.ts` — production server
- `test.ts` — test runner
- `prepare.ts` — pre-run preparation
- `cms-sync.ts` — sync CMS content
- `create.ts` — scaffold new stores
- `generate.ts` — top-level type generation entry
- `generate-graphql.ts` — GraphQL type generation
- `generate-types.ts` — TypeScript type generation
- `generate-i18n.ts` — i18n message generation (paired with `generate-i18n.test.ts`)
- `cache-graphql.ts` — cache GraphQL persisted documents

## Build Ordering (NON-NEGOTIABLE)

`@faststore/cli` MUST be compiled **before** `@faststore/core` or `@faststore/api` can run their `generate` step. This is enforced by `turbo.json`:

- `@faststore/core#generate` explicitly depends on `@faststore/cli#build`
- `@faststore/api#build` depends on its own `generate` step (which in turn depends on the CLI)

When working on the CLI, always re-build (`pnpm build` in this package) before running generate steps in downstream packages.

## Tests

```bash
cd packages/cli
pnpm vitest run
```

Command tests should mock the file system and external processes — use `src/__mocks__/` for shared fixtures.

## Adding a Command

1. Create `src/commands/{command-name}.ts` following the oclif convention.
2. Document inputs, flags, and side effects in the file header.
3. If the command writes to disk or modifies downstream packages, mock those interactions in tests.
4. Add a test file alongside (or under `test/`) matching `{command-name}.test.ts`.

## Build Output

Built with tsup. Output goes to `dist/`. The CLI binary is exposed via `bin/`.
