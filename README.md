<p align="center">
  <a href="https://developers.vtex.com/docs/guides/faststore">
    <img alt="Faststore" src="./packages/ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore v4
</h1>
<p align="center">
  <strong>
    Fullstack ecommerce toolkit
  </strong>
</p>
<p align="center">
  FastStore is a fullstack toolkit based on React and Next.js that helps developers build performant, stable, SEO-ready, and analytics-ready storefronts.
</p>


- <strong>Performance</strong>: We use strict budgets to ensure our libs are always light and fast.
- <strong>Stability</strong>: Generate your pages ahead by using a Jamstack ready toolkit.
- <strong>SEO/Analytics</strong>: Built-in hooks and events for your analytics provider.
- <strong>Freedom</strong>: Compose with our API, SDK, and UI components using Next.js.
- <strong>Speed</strong>: Customize our starter to fit your needs — architecture, tests, and infrastructure are all taken care of.

## Getting started

[Check out the docs](https://developers.vtex.com/docs/guides/faststore/getting-started-overview) to quickstart from our official starter and start creating.

## Official Starter

- [starter.store](https://github.com/vtex-sites/starter.store): FastStore starter for a generic Next.js storefront.

Follow the [FastStore getting started guide](https://developers.vtex.com/docs/guides/faststore/getting-started-overview) to set up your environment and create your first storefront through the WebOps onboarding flow.

## Learn

Check out our [FastStore Docs](https://developers.vtex.com/docs/guides/faststore/getting-started-overview) to deep dive in the world of building FastStores.

## Contributing

We welcome all kinds of contributions — bug fixes, new features, and documentation improvements. Check out the [Contributing guidelines](CONTRIBUTING.md) to get started. The monorepo is managed with pnpm, orchestrated by Turbo, and versioned with Lerna.

## Getting help

If you find any issues on the project you would like to report, please create an [issue](https://github.com/vtex/faststore/issues) on the repository. If you have a question, idea, or want to show us something cool you have built, feel free to create a [discussion](https://github.com/vtex/faststore/discussions).

## Packages

| Package | Description | Status |
| :--- | :--- | :---: |
| `@faststore/core` | Bundles FastStore source code - components, pages, SDK logic, and server-side utilities into a ready-to-use storefront boilerplate. | [![npm version](https://badge.fury.io/js/%40faststore%2Fcore.svg)](https://badge.fury.io/js/%40faststore%2Fcore) |
| `@faststore/api` | GraphQL API layer that connects to e-commerce platforms (e.g. VTEX), defines the data contract, and handles fetching and mutations. | [![npm version](https://badge.fury.io/js/%40faststore%2Fapi.svg)](https://badge.fury.io/js/%40faststore%2Fapi) |
| `@faststore/sdk` | Lightweight state management library for core e-commerce logic: analytics, cart, search, and user sessions. | [![npm version](https://badge.fury.io/js/%40faststore%2Fsdk.svg)](https://badge.fury.io/js/%40faststore%2Fsdk) |
| `@faststore/components` | Style-agnostic React components following Atomic Design principles — structure, logic, and accessibility without any styling. | [![npm version](https://badge.fury.io/js/%40faststore%2Fcomponents.svg)](https://badge.fury.io/js/%40faststore%2Fcomponents) |
| `@faststore/ui` | Foundational styling layer — design tokens, global styles, and basic UI components. Check out our [component docs](https://developers.vtex.com/docs/guides/faststore/components-index). | [![npm version](https://badge.fury.io/js/%40faststore%2Fui.svg)](https://badge.fury.io/js/%40faststore%2Fui) |
| `@faststore/cli` | CLI for initializing projects, running local dev servers, building, and syncing GraphQL schemas and CMS data. | [![npm version](https://badge.fury.io/js/%40faststore%2Fcli.svg)](https://badge.fury.io/js/%40faststore%2Fcli) |

## Development Tooling

These packages are part of the monorepo but are not intended for direct use by store builders:

| Package | Description |
| :--- | :--- |
| `@faststore/lighthouse` | Generates Lighthouse CI configurations for automated performance audits and quality gates. |
| `@faststore/diagnostics` | OpenTelemetry tracing and observability for monitoring application performance. |
| `@faststore/storybook` | Isolated environment for developing and documenting UI components (not published). |

## License

Licensed under the [MIT license](https://github.com/vtex/faststore/blob/master/LICENSE)
