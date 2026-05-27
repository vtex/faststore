# AGENTS.md — FastStore Project Guide for AI Agents

> **Purpose**: This document helps AI agents understand the FastStore codebase architecture, conventions, and workflows. It is the **public charter** for all contributors (OSS and internal) and is normative — read it before opening a PR.

## Governance Reference

**Authority chain:**

1. This `AGENTS.md` (root) — substantive principles and conventions
2. Scoped `packages/*/AGENTS.md` — package-specific context
3. Skill definitions (`~/.agents/skills/*`, `vtex-agent-skills`) — execution-level recipes

The non-negotiable rules below are normative for **all contributors**. Local rules in scoped `AGENTS.md` files may extend (but not contradict) this root.

Internal maintainers also follow additional private documents (a constitution and spec-kit governance artifacts) that incorporate the Architectural Principles, Security & Data Handling, Dependency Discipline, and Agent Autonomy Boundaries sections of this file by reference. External contributors do not need access to those private documents to contribute effectively.

## Architectural Principles

### I. Package Separation & Responsibility

Each package within the FastStore monorepo MUST maintain clear boundaries and a single responsibility:

- **`@faststore/api`**: GraphQL BFF abstraction serving as the data layer. MUST expose only GraphQL interfaces and handle platform-specific integrations.
- **`@faststore/sdk`**: Business rules and state management. AVOID having framework-specific code (React, Vue, etc.).
- **`@faststore/components`**: React-specific component implementations. MUST focus on component behavior and structure, delegating styling to `@faststore/ui`.
- **`@faststore/ui`**: Styling layer using SCSS. MUST provide themeable design tokens and component styles without implementation logic.
- **`@faststore/core`**: Integration layer that orchestrates all packages and contains experimental features. Acts as the reference implementation and starter template.
- **`@faststore/lighthouse`**: Performance monitoring configuration.
- **`@faststore/storybook`**: Design system documentation and component testing. MUST contain only UI component visualization, documentation, and unit tests. No business logic.
- **`@faststore/cli`**: Command-line tooling for scaffolding, building, and managing FastStore projects.
- **`@faststore/diagnostics`**: Observability integration.

### II. Performance-First Architecture (NON-NEGOTIABLE)

- `@faststore/core` MUST generate static pages using Jamstack principles for optimal TTFB and Core Web Vitals.
- Performance regressions in bundle size, Lighthouse scores, or Core Web Vitals MUST block merges.
- Lighthouse CI runs on PRs targeting `@faststore/core` and user-facing packages.

### III. Framework Agnosticism Where Applicable

- `@faststore/api` MUST expose framework-agnostic GraphQL interfaces.
- Only `@faststore/components`, `@faststore/sdk` and `@faststore/core` may contain React-specific code.

### IV. Design System as Documentation

- `@faststore/storybook` MUST document all components from `@faststore/components` and `@faststore/ui`.
- Every component MUST have Storybook stories demonstrating variants, states, and props.
- Visual regression tests run against Storybook to prevent unintended UI changes.
- Storybook MUST NOT contain business logic — only presentation-layer documentation.

### V. Monorepo Discipline

- Circular dependencies between packages are FORBIDDEN.
- Dependency graph MUST flow: `cli → core → (ui + api + sdk + lighthouse) → components`. `sdk` MUST NOT depend on `ui`, `components`, or `api`.
- All packages MUST specify exact internal package versions (no `workspace:*` in published packages).
- Turborepo enforces build order based on the dependency graph.
- Changes affecting multiple packages MUST be tested together before merge.

### VI. Test-Driven Stability

- `@faststore/sdk` MUST maintain >90% test coverage for business logic.
- `@faststore/components` MUST have unit tests for component behavior.
- `@faststore/storybook` MUST include visual regression tests.
- Breaking changes MUST include migration guides and deprecation warnings.
- All tests MUST pass before merge — no exceptions.

### VII. Conventional Commits & Semantic Versioning

- Commit format: `<type>(<scope>): <description>` (e.g. `feat(sdk): add cart persistence`).
- Allowed types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `ci`, `test`.
- Allowed scopes: `core`, `ui`, `api`, `components`, `sdk`, `lighthouse`, `diagnostics`, `deps`, `deps-dev`. PRs using any other scope will fail the "Lint PR" CI check enforced by `.github/workflows/pr.yml`.
- Breaking changes MUST include `BREAKING CHANGE:` in commit body or `!` after type.
- Lerna automatically versions packages based on Conventional Commits.
- All packages follow `MAJOR.MINOR.PATCH` semantic versioning.

## Security & Data Handling

- Secrets MUST NOT be committed to the repository.
- Modifications to authentication, CSRF, or CSP mechanisms require explicit human approval recorded in the PR description.

## Dependency Discipline

### Shared Versions

- Shared dependency versions live in `pnpm-workspace.yaml` via the `catalog:` feature. Duplicating versions across packages is forbidden — reference the catalog version (e.g. `"vitest": "catalog:"`).
- When bumping a catalog entry, all consumers MUST be re-tested in the same PR.

### Adding a Third-Party Dependency

Adding a new third-party package is a **deliberate decision**, not a default. Before introducing one:

1. **Justify the need.** Prefer the standard library, an existing dependency, or a small in-repo utility. A new dependency is only acceptable when it removes meaningful complexity, risk, or maintenance burden that the team would otherwise own.
2. **Evaluate the package.** It MUST be:
   - actively maintained (recent releases, responsive issue tracker);
   - compatible with the repository's MIT license (no GPL/AGPL/SSPL or other copyleft);
   - free of known critical vulnerabilities (`pnpm audit` clean for the new tree);
   - typed (ships its own types or has a maintained `@types/*` package).
3. **Measure the impact.** For runtime dependencies in user-facing packages (`@faststore/core`, `@faststore/components`, `@faststore/ui`, `@faststore/sdk`), check the bundle cost via `pnpm size` and the published bundle on [bundlephobia](https://bundlephobia.com/) / [pkg-size.dev](https://pkg-size.dev/). Regressions against the existing budget MUST block the PR.
4. **Pick the right bucket.**
   - `dependencies`: required at runtime by the published package.
   - `devDependencies`: only used during build, lint, or test.
   - `peerDependencies`: framework or host package the consumer is expected to provide (e.g. `react`, `next`).
   - Never duplicate a `peerDependency` in `dependencies`.
5. **Pin via the catalog.** If the dependency is (or could be) shared by more than one package, add it to `pnpm-workspace.yaml` under `catalog:` and reference it as `"<pkg>": "catalog:"`. Single-package dev tooling may be declared locally.
6. **Respect the package's role.**
   - `@faststore/sdk` Prefer zero-dependency solutions (see [`packages/sdk/AGENTS.md`](packages/sdk/AGENTS.md)).
   - `@faststore/components` and `@faststore/ui` MUST NOT pull in heavy runtime dependencies for visual concerns that can be solved with CSS or existing primitives.
7. **Document the choice.** Mention in the PR description what was evaluated, why the dependency was chosen over alternatives, and the bundle delta when applicable.

Any of the following require **explicit human approval** (see [Agent Autonomy Boundaries](#agent-autonomy-boundaries)):

- Adding a new runtime dependency to `@faststore/sdk`, `@faststore/components`, `@faststore/ui`, or `@faststore/api`.
- Replacing or removing an existing public-facing dependency.
- Bumping a dependency across a major version.
- Adding any package with a non-permissive license, unclear maintenance status, or known unresolved CVEs.

## Agent Autonomy Boundaries

Allowed without approval:

- Edit code in `@faststore/{core,components,ui,sdk,api,cli}` respecting the principles above.
- Add or update tests.
- Update non-generated docs, including this `AGENTS.md`.

Forbidden without explicit human approval:

- Edit `@generated/` or `__generated__/` directories directly.
- Bump major versions, change package `exports`, or alter public type signatures.
- Modify authentication, authorization, CSP, CI/CD pipelines, or production env config.
- Remove or skip tests to make a build pass.
- Add third-party scripts to `@faststore/core` outside of Partytown integration.
- Add a new runtime third-party dependency to a published package (`@faststore/{sdk,components,ui,api,core,cli}`) without following the [Dependency Discipline](#dependency-discipline) checklist and recording the evaluation in the PR description.

## Expected Skills

When working in this repository, prefer the following skills:

- `specification`, `implementing` — SDD Lite flow (small-to-medium tasks)
- `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.analyze`, `/speckit.implement` — SDD Full flow (larger or higher-risk tasks)
- `prd-writer`, `rfc-writer`, `plan-backlog-jira` — discovery and planning

Avoid creating local skills that duplicate the official VTEX skills.

## Expected MCPs

- `vtex-developer`, `vtex-docs` — VTEX public developer docs
- `github` — cross-repo context, PR/issue inspection
- `user-vtex-docs` — VTEX platform documentation lookups
- `playwright` and `chrome-devtools` — runtime debugging when E2E behavior matters
- `Figma` for specific frontend integrations

Internal team agents may also configure `atlassian`.

## Scoped Guides

Package-specific conventions live alongside the code:

- [`packages/components/AGENTS.md`](packages/components/AGENTS.md) — atomic design, data attributes, two-package architecture
- [`packages/core/AGENTS.md`](packages/core/AGENTS.md) — Next.js patterns, sections.json, browser vs node tests
- [`packages/api/AGENTS.md`](packages/api/AGENTS.md) — GraphQL schema conventions, codegen, platform integrations
- [`packages/sdk/AGENTS.md`](packages/sdk/AGENTS.md) — framework-agnostic discipline, bundle budget, store conventions
- [`packages/cli/AGENTS.md`](packages/cli/AGENTS.md) — oclif command structure, generate ordering

Other packages (`diagnostics`, `lighthouse`, `storybook`, `ui`) do not have a scoped file because their conventions are sufficiently captured by this root document.

---

## Project Overview

**FastStore** is a fullstack e-commerce toolkit built on React and Next.js that helps developers build performant, stable, SEO-ready e-commerce sites. It is a monorepo maintained by VTEX.

**Key features:** performance-focused with strict budgets, Jamstack architecture, analytics and SEO ready, React and Next.js based, customizable UI components, GraphQL API layer.

**License:** MIT
**Repository:** https://github.com/vtex/faststore

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         @faststore/core                 │
│  (Next.js app + components + pages)     │
└─────────────────────────────────────────┘
           ↓              ↓
    ┌──────────┐    ┌──────────┐
    │   SDK    │    │   API    │
    └──────────┘    └──────────┘
           ↓              ↓
    ┌──────────┐    ┌──────────┐
    │    UI    │    │ GraphQL  │
    │Components│    │  Layer   │
    └──────────┘    └──────────┘
```

Key patterns: Component-based (atomic design), GraphQL-first data fetching, Next.js SSR/SSG, headless CMS integration, analytics-ready.

## Monorepo Structure

FastStore uses a **pnpm workspace** monorepo:

- **pnpm** 9.15.5: package manager
- **Lerna** ^9.0.3: versioning and publishing
- **Turbo** ^2.3.4: build orchestration
- **Biome**: linting and formatting

### Package Organization

```
packages/
├── api/              # GraphQL API layer
├── cli/              # Command-line tools
├── components/       # React components structure layer (unstyled)
├── core/             # Main application (Next.js)
├── diagnostics/      # OpenTelemetry integration for observability
├── graphql-utils/    # GraphQL utilities
├── lighthouse/       # Performance testing
├── sdk/              # Business logic hooks
├── storybook/        # Component documentation
└── ui/               # UI components and styles layer
```

### Build Pipeline (Turbo)

- `build` depends on `^build` (upstream packages build before consumers)
- `test` depends on `^build`
- `@faststore/core#generate` depends on `@faststore/cli#build` — CLI MUST compile before type generation
- `@faststore/api#build` depends on its own `generate` step
- `dev` and `dev:server` have caching disabled
- `size` is a dedicated task for bundle size budgets

### Dual Module Output

All library packages export both ESM and CJS via conditional `exports`:

- ESM: `dist/es/index.mjs`
- CJS: `dist/cjs/index.js`
- Types: `dist/typings/`

Each package exposes a single top-level entry. Internal helpers are not re-exported from the public entry.

## Development Workflow

### Setup

```bash
pnpm install
pnpm build
pnpm dev
pnpm turbo run dev --filter=@faststore/core   # run a specific package
```

### Common Commands

```bash
# Linting
pnpm lint           # check with Biome
pnpm lint:fix       # auto-fix with Biome
pnpm stylelint      # check SCSS
pnpm stylelint:fix  # auto-fix SCSS

# Testing
pnpm test                                              # all tests
pnpm turbo run test --filter=@faststore/sdk            # specific package
cd packages/sdk && pnpm vitest run test/hooks.test.ts  # single file
cd packages/api && pnpm test:unit                      # API unit only
cd packages/api && pnpm test:int                       # API integration only

# Building
pnpm build          # build all packages
pnpm size           # check bundle size budgets

# Releasing
pnpm release        # release new version (main)
pnpm release:dev    # release dev version (dev tag)
```

### Branch Strategy

- **`main`**: production releases (`latest` tag).
- **`dev`**: active development (`dev` tag).
- **`3.x`**: v3 releases (`v3-latest` tag).
- Feature branches: `feat/`, `fix/`, `chore/` prefixes.
- Hotfixes: direct to `main`, requires team communication.
- Release cadence: `dev → main` every two weeks.

### Testing Changes in a Store

1. Create a PR (can be draft).
2. Find the `ci/codesandbox` check → "Details".
3. Use "Local Install Instructions" to test in a starter store.
4. Update dependencies: `pnpm install`.

## Code Organization

### Component Hierarchy

FastStore uses Atomic Design:

1. **Atoms** (`/atoms/`): basic building blocks (Badge, Button, Icon, Input, Label).
2. **Molecules** (`/molecules/`): simple combinations (Accordion, CartItem, SearchInput, ProductCard).
3. **Organisms** (`/organisms/`): complex feature components (ImageGallery, PriceRange, ProductShelf).
4. **Sections** (`/sections/` in `@faststore/core`): page sections (ProductDetails, Hero, Newsletter).

For details on contributing components to the library, see [`packages/components/AGENTS.md`](packages/components/AGENTS.md).

### File Naming Conventions

- **Components**: PascalCase folder + file (`Button/Button.tsx`).
- **Barrel exports**: every component folder exposes `index.ts`.
- **Hooks**: camelCase with `use` prefix (`useFormattedPrice.ts`).
- **Utilities**: camelCase (`formatPrice.ts`).
- **Styles**: match component name (`ProductCard.scss`).
- **Tests**: match source with `.test.` (`ProductCard.test.tsx`).

### TypeScript Conventions

- **Prop interfaces**: `{ComponentName}Props`.
- Extend matching HTML elements when applicable: `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`.
- **Variant union types** exported alongside the component: `type Variant = 'primary' | 'secondary'`.
- All `Props` and variant types re-exported from the barrel `index.ts`.
- TypeScript strict mode enabled globally.

### Code Style (Biome)

- Single quotes, no semicolons, ES5 trailing commas, 2-space indentation.
- Run `pnpm lint` to check, `pnpm lint:fix` to auto-fix.

### Compound Components

For components with sub-parts (e.g. `Accordion` + `AccordionButton` + `AccordionPanel`):

- Co-locate all sub-components in one folder.
- **Default export**: the main component.
- **Named exports**: sub-components and types.
- Re-export everything through the barrel `index.ts`.

## Tech Stack

**Frontend:** React 18.2, Next.js ^16, TypeScript 5.9.3, SCSS, SWR ^2.2.5.
**GraphQL:** GraphQL 16.11.0, GraphQL Codegen, Envelop.
**Build tools:** Turbo, pnpm, Lerna, Biome.
**Testing:** Vitest, Cypress, Testing Library, `vitest-axe`, Lighthouse.
**Other:** Lexical (rich text), Partytown (third-party scripts), Sharp (image optimization).

## Testing

### Unit Tests (Vitest)

```bash
pnpm test                                              # all
pnpm turbo run test --filter=@faststore/sdk            # one package
cd packages/sdk && pnpm vitest run test/hooks.test.ts  # one file
```

### Browser vs Node tests (`@faststore/core`)

- Node tests: `*.test.{ts,tsx}`.
- Browser tests: `*.browser.test.{ts,tsx}`.

### Unit vs Integration tests (`@faststore/api`)

```bash
cd packages/api
pnpm test:unit
pnpm test:int
```

### E2E (Cypress) and Lighthouse — in `@faststore/core`

```bash
cd packages/core
pnpm test:e2e
pnpm lhci
```

### Test File Locations

- `test/` directories in each package
- `*.test.ts` / `*.test.tsx` alongside source files
- `*.browser.test.{ts,tsx}` for browser-env tests in `@faststore/core`
- `cypress/` in `@faststore/core`

## Navigation Tips

**Components:** UI primitives → `packages/ui/src/components/`. React structure → `packages/components/src/`. Core sections → `packages/core/src/components/sections/`. Pages → `packages/core/src/pages/`.

**Business logic:** Hooks → `packages/sdk/src/`. Core SDK → `packages/core/src/sdk/`. Utilities → `packages/core/src/utils/`.

**API / GraphQL:** Type definitions → `packages/api/src/typeDefs/`. Platform integration → `packages/api/src/platforms/vtex/`. Directives → `packages/api/src/directives/`. Generated types → `@generated/` or `__generated__/`.

**Styles:** UI styles → `packages/ui/src/components/`. Global → `packages/ui/src/styles/`. Core → `packages/core/src/styles/`. Component styles → `ComponentName.scss` next to `ComponentName.tsx`.

**Configuration:** CMS → `packages/core/cms/faststore/sections.json`. Next.js → `packages/core/next.config.js`. Discovery → `packages/core/discovery.config.default.js`. GraphQL codegen → `packages/core/codegen.ts` or `packages/api/codegen.yml`.

## Common Tasks

For task-specific guidance, consult the scoped `AGENTS.md` listed in [Scoped Guides](#scoped-guides). The short reference below points you to the right file.

| Task                               | Where to look                                                              |
| ---------------------------------- | -------------------------------------------------------------------------- |
| Contribute a new library component | [`packages/components/AGENTS.md`](packages/components/AGENTS.md)           |
| Add a section or page              | [`packages/core/AGENTS.md`](packages/core/AGENTS.md)                       |
| Modify GraphQL schema              | [`packages/api/AGENTS.md`](packages/api/AGENTS.md)                         |
| Add an analytics event             | [`packages/sdk/AGENTS.md`](packages/sdk/AGENTS.md), under `src/analytics/` |
| Add a CLI command                  | [`packages/cli/AGENTS.md`](packages/cli/AGENTS.md)                         |
| Update global styles or tokens     | `packages/ui/src/styles/`                                                  |

## Important Considerations

### DO NOT Edit

- `@generated/` or `__generated__/` directories
- `dist/` directories
- Files with "auto-generated" comments
- `node_modules/`

### Always Check Before Merging

- **Linting:** `pnpm lint`
- **Type safety:** TypeScript compiles cleanly
- **Tests:** relevant suites pass
- **Build:** `pnpm build` succeeds

### Performance Budgets

FastStore has strict performance budgets. Be mindful of bundle size, image optimization, code splitting, and Lighthouse scores.

### Platform Integration

Most code is platform-agnostic. Platform-specific code lives in `packages/api/src/platforms/`. Currently focused on VTEX.

## Additional Resources

- Documentation: https://developers.vtex.com/docs/guides/faststore/getting-started-overview
- Starter Store: https://github.com/vtex-sites/starter.store
- Issues: https://github.com/vtex/faststore/issues
- Discussions: https://github.com/vtex/faststore/discussions

## Quick Reference

### Package Import Paths

```typescript
import { useCart } from "@faststore/sdk";
import { Button } from "@faststore/ui";
import { API } from "@faststore/api"; // in core
import { Layout } from "@faststore/core"; // in other packages
```

### When to Use Which Package

| Task                                         | Package                 | Pattern                    | Styling                        |
| -------------------------------------------- | ----------------------- | -------------------------- | ------------------------------ |
| Reusable component for the FastStore library | `@faststore/components` | Data attributes, no styles | Add to `@faststore/ui`         |
| Store section/page                           | `@faststore/core`       | SCSS modules               | `.module.scss` files           |
| Store-specific UI component                  | `@faststore/core`       | Compose library components | SCSS modules or library styles |
| Global styles/tokens                         | `@faststore/ui`         | Global tokens              | `src/styles/`                  |

### Environment Variables

- `packages/core/vtex.env`
- `.env.local` (user-created, not committed)
- `turbo.json` — `globalEnv` section

### Version Management

- All packages synchronized at the same version
- Managed by Lerna
- Follows Conventional Commits for changelogs
- Semantic versioning

---

**Maintained by:** FS Discovery Team
