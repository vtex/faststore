<p align="center">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
</p>
<h1 align="center">
  FastStore Storybook
</h1>
<p align="center">
  <strong>
    Isolated UI component development and documentation environment
  </strong>
</p>


`@faststore/storybook` provides an isolated environment for developing, testing, and documenting FastStore UI components. It is an internal development tool — not published to npm.

Stories import components from `@faststore/components` and are styled via `@faststore/ui`, making it a live preview of both the structure and the visual output of the component library.

> **Note:** Stories coverage is currently incomplete. Only a subset of components in `@faststore/components` have stories. Adding stories for missing components is welcome.

## Package structure

```
stories/          # One .stories.tsx file per component
.storybook/
├── main.ts       # Storybook config (framework, addons, story paths)
├── preview.ts    # Global decorators and parameters
└── styles.scss   # Imports @faststore/ui styles for all stories
```

## How to run

### Prerequisites

- Node.js ≥ 20
- pnpm

### Local setup

```bash
# 1. Install dependencies (from the repo root)
pnpm install

# 2. Start Storybook
pnpm dev
```

Storybook will be available at `http://localhost:6006`.

## How to develop

### Adding a story for a new component

1. Create `stories/{component-name}.stories.tsx`
2. Import the component from `@faststore/ui`:
   ```tsx
   import { Badge } from '@faststore/ui'
   import type { Meta, StoryObj } from '@storybook/nextjs'

   const meta: Meta<typeof Badge> = {
     title: 'Atoms/Badge',
     component: Badge,
   }

   export default meta
   type Story = StoryObj<typeof Badge>

   export const Default: Story = {
     args: {
       variant: 'info',
       children: 'New',
     },
   }
   ```

> **Note:** Existing stories use the older Storybook v8 format (plain function exports, no `Meta`/`StoryObj` types). New stories should follow the CSF3 format shown above.

3. Styles are applied automatically via `.storybook/styles.scss` — no additional imports needed

## Documentation

- **`@faststore/components`:** [`packages/components/`](../components/README.md) — component structure and data attributes
- **`@faststore/ui`:** [`packages/ui/`](../ui/README.md) — styling layer
- **Storybook docs:** [storybook.js.org](https://storybook.js.org/docs)
