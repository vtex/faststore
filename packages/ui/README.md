<p align="center">
  <a href="https://developers.vtex.com/docs/guides/faststore">
    <img alt="Faststore" src="./static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore UI
</h1>
<p align="center">
  <strong>
    Lightweight ecommerce component library
  </strong>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@faststore/ui">
    <img src="https://badge.fury.io/js/%40faststore%2Fui.svg" alt="npm version" />
  </a>
</p>

`@faststore/ui` is the styling layer for FastStore UI components. It re-exports all components from `@faststore/components` and adds two styling layers on top:

- **Design tokens** — global CSS custom properties for colors, typography, spacing, borders, and shadows
- **Structural styles** — minimum SCSS needed for components to function, using data attribute selectors

Components in this package have no styles by default — all customization happens through the token system.

## Package structure

```
src/
├── components/
│   ├── atoms/       # SCSS per atom (e.g. Badge/styles.scss, Button/styles.scss)
│   ├── molecules/   # SCSS per molecule
│   └── organisms/   # SCSS per organism
├── styles/
│   ├── base/        # Global reset, tokens, typography, layout, utilities
│   ├── components.scss  # Imports all component stylesheets
│   └── global.scss      # Entry point for all styles
├── typings/         # Shared TypeScript types
└── index.ts         # Re-exports all components from @faststore/components
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

For interactive visual testing, use Storybook. Run `pnpm dev` from `packages/storybook/`.

## How to develop

### Adding styles for a new component

1. Create `src/components/{category}/{ComponentName}/styles.scss`
2. Use the component's root data attribute as the selector:
   ```scss
   [data-fs-badge] {
     // 1. Define local tokens mapped to global tokens
     --fs-badge-padding: var(--fs-spacing-2);
     --fs-badge-text-color: var(--fs-color-text);

     // 2. Apply structural styles using local tokens
     color: var(--fs-badge-text-color);

     // 3. Variant styles using state attributes
     &[data-fs-badge-variant="success"] {
       --fs-badge-text-color: var(--fs-color-success-text);
     }
   }
   ```
3. Register the stylesheet in `src/styles/components.scss`:
   ```scss
   @import "../components/atoms/Badge/styles";
   ```

> Always map local tokens to global tokens first — this ensures compatibility with theme customization. See [`AGENTS.md`](../../AGENTS.md#step-3-add-styling-faststoreui) for the full styling guidelines.

## How to publish

Versioning and publishing are managed at the monorepo root by Lerna. Do not publish this package independently. Refer to the [Contributing guidelines](../../CONTRIBUTING.MD) for the full release workflow.

## Documentation

- **Component reference:** [developers.vtex.com/docs/guides/faststore/components-index](https://developers.vtex.com/docs/guides/faststore/components-index)
- **Styling guidelines:** [`AGENTS.md`](../../AGENTS.md#step-3-add-styling-faststoreui)
