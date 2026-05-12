<p align="center">
  <a href="https://developers.vtex.com/docs/guides/faststore">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  Faststore Lighthouse
</h1>
<p align="center">
  <strong>
    Lighthouse CI configuration generator for FastStore
  </strong>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@faststore/lighthouse">
    <img src="https://badge.fury.io/js/%40faststore%2Flighthouse.svg" alt="npm version" />
  </a>
</p>


`@faststore/lighthouse` generates a [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) configuration object with FastStore's default performance budgets and assertions. It is used by `@faststore/core` via `lighthouserc.js` to enforce quality gates on every CI run.

## Default budgets

The generated config enforces the following minimum scores:

| Category | Threshold |
| :--- | :--- |
| Performance | ≥ 0.95 |
| Accessibility | 1.0 |
| Best Practices | 1.0 |
| SEO | 1.0 |

Key metric budgets: FCP ≤ 1800ms, LCP ≤ 2500ms, TBT ≤ 350ms, CLS ≤ 0.1, total resource size ≤ 600 KB.

## How to use

In your store's `lighthouserc.js`:

```js
const lhConfig = require('@faststore/lighthouse').default

module.exports = lhConfig({
  urls: ['/'],               // pages to audit
  server: 'https://your-store.com',
  assertions: {
    // override or extend default assertions
    'csp-xss': 'off',
  },
})
```

The `BASE_SITE_URL` environment variable can be used instead of `server` when running in CI.

## How to develop
All logic lives in a single file: `src/index.ts`. To make changes:
1. Edit `src/index.ts`

2. Run `pnpm build` to compile

3. Verify the output in `packages/core` — since it's a workspace dependency, `lighthouserc.js` will pick up your local build automatically. Changes to default budgets or assertions are validated through the actual Lighthouse CI run. If you update a threshold, check whether `packages/core/lighthouserc.js` overrides it, as store-level assertions take precedence.


## How to run

### Prerequisites

- Node.js ≥ 20
- pnpm

### Local setup

```bash
# 1. Install dependencies (from the repo root)
pnpm install

# 2. Build the package
pnpm build
```

## How to publish

Versioning and publishing are managed at the monorepo root by Lerna. Do not publish this package independently. Refer to the [Contributing guidelines](../../CONTRIBUTING.MD) for the full release workflow.

## Documentation

- **Lighthouse CI:** [github.com/GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci)
