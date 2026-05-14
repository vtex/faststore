# AGENTS.md — `@faststore/core`

> Inherits from [`/AGENTS.md`](../../AGENTS.md) (root). This file adds context specific to `@faststore/core`.

## Purpose

`@faststore/core` is the **integration layer** that orchestrates all packages. It is a Next.js application acting as the reference implementation and starter template for FastStore stores.

## Tech

- Next.js 16 (SSR/SSG)
- React 18.2
- GraphQL via `@faststore/api`
- SCSS Modules for component styles

## Key Directories

- `src/components/` — application components grouped by domain (`account`, `cart`, `cms`, `localization`, `navigation`, `product`, `region`, `search`, `sections`, `templates`, `ui`)
- `src/pages/` — Next.js file-based routing
- `src/sdk/` — store-level SDK logic and hooks
- `src/server/` — server-side utilities
- `src/customizations/` — store-specific overrides
- `src/experimental/` — experimental features
- `cms/faststore/` — CMS configuration (`sections.json`, `base.jsonc`, `content-types.json`)
- `@generated/` — auto-generated GraphQL types (DO NOT edit)
- `api/` — GraphQL handler setup
- `cypress/` — E2E tests

## Key Files

- `next.config.js` — Next.js configuration
- `discovery.config.default.js` / `discovery.config.js` — store routing/discovery
- `codegen.ts` — GraphQL code generation config
- `cms/faststore/sections.json` — CMS sections definition (~2700 lines)
- `src/Layout.tsx` — main layout
- `src/constants.ts` — app constants
- `vtex.env` — platform env file
- `lighthouserc.js` — Lighthouse CI config
- `next-seo.config.ts` — SEO defaults

## Common Patterns

### Section/Page component with SCSS Modules

```tsx
// src/components/sections/MySection/MySection.tsx
import styles from './my-section.module.scss'

export interface MySectionProps {
  title: string
  buyButton: { label: string }
}

function MySection({ title, buyButton }: MySectionProps) {
  return (
    <Section className={styles.section}>
      {/* JSX using library components */}
    </Section>
  )
}

export default MySection
```

### Composing with library components

Import from `@faststore/ui` and alias with `UI` prefix to avoid local name collisions:

```tsx
import {
  Accordion as UIAccordion,
  AccordionButton as UIAccordionButton,
  AccordionItem as UIAccordionItem,
  AccordionPanel as UIAccordionPanel,
} from '@faststore/ui'

function ProductDescription({ descriptionData }: Props) {
  return (
    <UIAccordion>
      <UIAccordionItem>
        <UIAccordionButton>Title</UIAccordionButton>
        <UIAccordionPanel>Content</UIAccordionPanel>
      </UIAccordionItem>
    </UIAccordion>
  )
}
```

### Analytics events

```ts
import { sendAnalyticsEvent } from '@faststore/sdk'

sendAnalyticsEvent({
  name: 'event_name',
  params: {
    /* event data */
  },
})
```

## Common Tasks

### Adding a section

1. Create component under `src/components/sections/MySection/` (SCSS Modules).
2. Compose with `@faststore/ui` components.
3. Add the section definition to `cms/faststore/sections.json` (props, schema, defaults).
4. Export from the section folder's `index.ts`.

### Adding a page

1. Create file under `src/pages/` (e.g. `product/[slug].tsx`).
2. Use Next.js conventions (`getStaticProps`, `getServerSideProps`).
3. Compose with sections and components.

### Adding a store-specific UI component

1. Place under `src/components/ui/` or `src/components/sections/`.
2. Create `*.module.scss` alongside the component.
3. Compose library components from `@faststore/ui`.

### Updating styles

- For core/sections: edit the `.module.scss` next to the component.
- For library tokens: edit `packages/ui/src/styles/`.

### Managing SVG icons

Icons are loaded from a single sprite at `public/icons.svg` via the `Icon` component from `@faststore/ui`.

1. Open `public/icons.svg` and add a new `<symbol>` with a unique `id`
2. Remove `fill`, `stroke-width`, `width`, `height`, and `color` attributes from the symbol so it can be styled via CSS
3. Use the icon in any component:

```tsx
import { Icon } from '@faststore/ui'

;<Icon name="Bell" weight="thin" />
```

This project uses icons from [Phosphor Icons](https://phosphoricons.com/).

## Tests

`@faststore/core` separates tests by environment:

- **Node tests:** `*.test.{ts,tsx}` run in Node.
- **Browser tests:** `*.browser.test.{ts,tsx}` run in a browser-like environment.

Run:

```bash
cd packages/core
pnpm test           # unit + integration
pnpm test:e2e       # Cypress E2E
pnpm lhci           # Lighthouse performance audit
```

## Generated Files (DO NOT EDIT)

- `@generated/` — GraphQL types
- `dist/` — build outputs

## Performance

`@faststore/core` MUST generate static pages using Jamstack principles for optimal TTFB and Core Web Vitals. Lighthouse CI gates apply. See root [Architectural Principles §II](../../AGENTS.md).
