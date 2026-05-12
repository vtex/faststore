<p align="center">
  <a href="https://developers.vtex.com/docs/guides/faststore">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore Components
</h1>
<p align="center">
  <strong>
    FastStore UI components without a style layer
  </strong>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@faststore/components">
    <img src="https://badge.fury.io/js/%40faststore%2Fcomponents.svg" alt="npm version" />
  </a>
</p>

`@faststore/components` provides the structure, logic, and accessibility of FastStore UI components — without any styling. It organizes the components into atoms, molecules, and organisms.

Styling is handled separately by `@faststore/ui`, which consumes this package and applies design tokens and structural SCSS on top of the data attributes defined here.

## Package structure

```
src/
├── atoms/       # Basic building blocks (Button, Input, Badge, Icon, etc.)
├── molecules/   # Composite components (Accordion, CartItem, ProductCard, etc.)
├── organisms/   # Complex feature components (Hero, Filter, ProductShelf, etc.)
├── hooks/       # UI state hooks (useSlider, useSearch, useTrapFocus, etc.)
├── typings/     # Shared TypeScript types
└── index.ts     # Public exports
test/
└── molecules/   # Component tests (incomplete — see note below)
```

> **Note:** Test coverage is currently incomplete. Tests should live in `test/{category}/{ComponentName}/` for all atoms, molecules, and organisms. Contributions adding missing test coverage are welcome.


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

### Adding a new component

1. **Categorize** the component: atom, molecule, or organism
2. **Create** `src/{category}/{ComponentName}/{ComponentName}.tsx` and `index.ts`
3. **Use data attributes** for styling hooks — no style imports in this package:
   ```tsx
   <div
     data-fs-badge            // root identifier
     data-fs-badge-size={size} // state attribute
   >
     {children}
   </div>
   ```
4. **Export** from `src/index.ts`
5. **Add styles** in `@faststore/ui` using the data attributes as selectors
6. **Write tests** in `test/{category}/{ComponentName}/`

> For the full implementation checklist (accessibility, props interface, composability guidelines), refer to the [Component Implementation Guidelines](../../AGENTS.md#-faststore-components-implementation-guidelines) in `AGENTS.md`.

### Data attribute naming convention

| Context | Pattern | Example |
| :--- | :--- | :--- |
| Root element | `data-fs-{component}` | `data-fs-badge` |
| Internal structure | `data-fs-{component}-{part}` | `data-fs-badge-wrapper` |
| State | `data-fs-{component}-{state}={value}` | `data-fs-button-variant="primary"` |

## How to test

```bash
pnpm test
```

For interactive visual testing, use Storybook. Run `pnpm dev` from `packages/storybook/` to launch it.

## How to publish

Versioning and publishing are managed at the monorepo root by Lerna. Do not publish this package independently. Refer to the [Contributing guidelines](../../CONTRIBUTING.MD) for the full release workflow.

## Documentation

- **Component reference:** [developers.vtex.com/docs/guides/faststore/components-index](https://developers.vtex.com/docs/guides/faststore/components-index)
- **Implementation guidelines:** [`AGENTS.md`](../../AGENTS.md#-faststore-components-implementation-guidelines)
