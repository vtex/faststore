<p align="center">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
</p>

<h1 align="center">FastStore Core</h1>

<p align="center">
  <a href="https://badge.fury.io/js/%40faststore%2Fcore">
    <img alt="npm version" src="https://badge.fury.io/js/%40faststore%2Fcore.svg" />
  </a>
</p>



`@faststore/core` is the main Next.js application for FastStore storefronts. It bundles together all the building blocks of a store — sections, pages, SDK hooks, server utilities, and CMS configuration — into a ready-to-use boilerplate.

Store builders consume this package through `@faststore/cli` and extend it via the `src/customizations/` directory. You will work directly in this package when contributing new sections, pages, SDK hooks, or CMS configurations to the FastStore platform.

## Package structure

```text
packages/core/
├── src/
│   ├── components/
│   │   ├── sections/     # Full-page content slices (Hero, ProductGallery, ProductShelf…)
│   │   ├── ui/           # Store-level UI components (compositions of @faststore/ui)
│   │   ├── skeletons/    # Loading state skeleton components
│   │   └── …             # Domain folders: cart, product, search, navigation, auth…
│   ├── pages/            # Next.js file-based routes
│   ├── sdk/              # Business logic hooks (cart, session, search, analytics…)
│   ├── server/           # Server-side utilities (CMS content fetching)
│   ├── customizations/   # Store-level overrides: styles, fonts, components, fragments
│   ├── styles/           # Global SCSS styles
│   └── instrumentation.ts  # Next.js instrumentation hook (boots @faststore/diagnostics when otelEnabled)
├── cms/faststore/        # CMS configuration: sections.json, content-types.json, schemas
├── @generated/           # Auto-generated GraphQL types — do not edit
├── discovery.config.default.js  # Committed base store configuration (platform, sales channel, locale)
├── discovery.config.js          # Merges default config with store-level customizations — do not edit directly
├── next.config.js        # Next.js configuration
├── codegen.ts            # GraphQL code generation config
└── lighthouserc.js       # Lighthouse CI configuration
```

## How to run

**Prerequisites:** Node ≥ 20, pnpm

```sh
pnpm install
pnpm dev        # generates GraphQL types, then starts the Next.js dev server
```

Your store will be available at `http://localhost:3000`.



> The `pnpm dev` command runs `pnpm generate` automatically before starting the dev server. You only need to run `pnpm generate` manually when you change a GraphQL query or fragment while the server is already running.

## How to develop

### Adding or modifying a section

Sections are full-page slices that can be managed via the CMS. They live in `src/components/sections/`.

1. Create `src/components/sections/{SectionName}/{SectionName}.tsx` and a companion `.module.scss`
2. Compose the section using components from `@faststore/ui`
3. Add the section definition to `cms/faststore/sections.json` (name, props, schema)
4. Export the section from the sections index

### Adding a store-level UI component

Store-level UI components (not intended for the shared library) live in `src/components/ui/`.

1. Create `src/components/ui/{ComponentName}/{ComponentName}.tsx` with a companion `.module.scss`
2. Compose using components from `@faststore/ui`
3. Use TypeScript for props — no `data-fs-*` attributes needed here (those belong in `@faststore/components`)

### Adding or modifying a GraphQL query

1. Edit or create a `.graphql` file with your query or fragment
2. Run `pnpm generate` to regenerate types under `@generated/`
3. Import the generated types from `@generated/graphql`

> Never edit files inside `@generated/` manually — they are overwritten on every `pnpm generate` run.

### Managing SVG icons

Icons are loaded from a single sprite at `public/icons.svg` via the `Icon` component from `@faststore/ui`.

1. Open `public/icons.svg` and add a new `<symbol>` with a unique `id`
2. Remove `fill`, `stroke-width`, `width`, `height`, and `color` attributes from the symbol so it can be styled via CSS
3. Use the icon in any component:

```tsx
import { Icon } from '@faststore/ui'

<Icon name="Bell" weight="thin" />
```

This project uses icons from [Phosphor Icons](https://phosphoricons.com/).

### Adding CMS configuration

FastStore currently supports two CMS content sources. The flow depends on which one we want to update.

#### Headless CMS (legacy)

1. Define the section schema in `cms/faststore/sections.json`
2. For new content types, add them to `cms/faststore/content-types.json`
3. Run `pnpm faststore cms-sync` to push changes to the CMS

#### CMS (new)

Schemas are defined as individual `.jsonc` files instead of a single `sections.json`.
To support both CMS versions, changes made to the legacy files are migrated to the new format using the split commands.

1. After updating `sections.json` or `content-types.json`, run the split commands to generate the new format:
```sh
vtex content split-components -i cms/faststore/sections.json -o cms/faststore/components
```

```sh
vtex content split-content-types -i cms/faststore/content-types.json -s cms/faststore/sections.json -o cms/faststore/pages
```

2. Generate the schema:
```sh
   vtex content generate-schema cms/faststore/components cms/faststore/pages -o cms/faststore/schema.json
```

3. Upload the schema to the Schema Registry:
```sh
vtex content upload-schema cms/faststore/schema.json
```

Files can be placed in `cms/components/` and `cms/pages/`, or co-located alongside their component in `src/components/`.

> For schema syntax and the full architectural overview, see the [CMS architecture and schema declarations](https://developers.vtex.com/docs/guides/understanding-cms-architecture-and-schema-declarations) guide.

## How to test

```sh
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # E2E tests (Cypress)
pnpm lhci         # Lighthouse performance audit
```

This project has strict performance budgets. The Lighthouse CI (`lhci`) runs automatically on every PR and enforces score minimums and metric budgets defined in `lighthouserc.js`.

## How to publish

This package is versioned and published as part of the FastStore monorepo release process, managed by Lerna at the monorepo root. Do not publish individually.

```sh
# From the monorepo root:
pnpm release      # publish to latest (main branch)
pnpm release:dev  # publish to dev tag (dev branch)
```

## Documentation

- [FastStore documentation](https://developers.vtex.com/docs/guides/faststore/getting-started-overview)
- [Theming and design tokens](https://developers.vtex.com/docs/guides/faststore/styling-overview)
- [CMS integration](https://developers.vtex.com/docs/guides/faststore/headless-cms-overview)
- [Next.js docs](https://nextjs.org/docs)
