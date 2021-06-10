# FastStore

## Table of contents

- [FastStore](#faststore)
  - [Table of contents](#table-of-contents)
  - [An open ecommerce framework](#an-open-ecommerce-framework)
  - [Why building FastStore?](#why-building-faststore)
  - [Project Philosophy](#project-philosophy)
  - [Why Jamstack?](#why-jamstack-and-gatsby)
  - [Continuous Performance and Stability](#continuous-performance-and-stability)
  - [Docs](#docs)
  - [Contributing](#contributing)
    - [How to develop](#how-to-develop)
  - [Packages](#packages)
  - [Who's using FastStore?](#whos-using-faststore)
  - [Troubleshooting](#troubleshooting)

## An open ecommerce framework

FastStore is an open ecommerce framework built using modern technologies that aims to deliver the building blocks necessary for creating your custom ecommerce experience. With these building blocks you can achieve:

- Multiregion stores with native internationalization support
- Great Performance (90+ on Google's page speed insights)
- SEO ready pages with Google's Rich Results support
- CMS managed content
- Jamstack based (deploy with Netlify, Vercel and any other JAMStack platform)
- Marketplace ready with support to millions of skus
- Intelligence via Google Analytics and GTM
- Evergreen stores with auto updates

## Why building FastStore?

The web is a wild and noisy environment. Many projects claim to solve many different aspects of web development but none of them solves the ecommerce problem satisfactorily. Ecommerce is a very complex case where performance is a must, but personalization is the key.

After years of developing ecommerces, FastStore creators packaged all of this knowledge into easy, ready to use building blocks for crafting production-ready, multi-region marketplaces.

FastStore not only contains code, but knowledge and guidelines to change the way you think and build ecommerces

## Project Philosophy

This project has a very well defined list of priorities. When solving an issue, a lower-ranking priority must not degrade or override an upper ranking priority.
The priorities are all about the stores' user experience and retailer satisfaction about it. For us that means:

1. Performance - Great score on Lighthouse and Core Web Vitals
2. Stability - E2E tests are complete and make sure the critical paths are covered
3. SEO - Stores should pass on all aspects of the Google search console, like complete structured data and web vitals
4. Feature completion - Enable you to craft your custom ecommerce experience

## Basic Architecture

FastStore core is composed of two main packages:
1. [`store-ui`](https://storeui.netlify.app/): A performant ecommerce ready component library
2. `store-sdk`: An SDK for ecommerce to solve your basic ecommerce needs, like cart, pixel management, session etc.

These packages have bindings to popular frameworks, like Gatsby. These bindings are listed in this monorepo and help you create stores with Multiregion, Internationalization etc.
We want to support other frameworks, like Next.JS and Create React App in the future

## Why Jamstack?

Jamstack focuses on performance and stability, which is part of our core philosophy.

## Continuous Performance and Stability

Maintaining the FastStore performance and stability is a key element. For this, using Lighthouse CI and Cypress in your CI/CD pipeline is **highly** recommended.

We provide a base setup for both platforms so you can easily add them to your CI/CD platform.

## Docs

FastStore docs are under development. If you are not sure where to start, make sure to check the [Getting Started](./docs/getting-started.md). Check out the available docs below:

- Concepts
  - [What is Jamstack](./docs/what-is-jamstack.md)
  - [What is Gatsby](./docs/what-is-gatsby.md)
  - [SFJ Architecture](./docs/architecture.md)
  - [Build Pipeline](./docs/build-pipeline.md)
  - [Page Rendering](./docs/rendering.md)
  - [Data structure](./docs/data-structure.md)
  - [SFJ Theme](./docs/sfj-theme.md)
  - [Sonarqube](./docs/sonarqube.md)
- How-to Guides
  - [How to Create a Component](./docs/component.md)
  - [How to Fetch Data](./docs/data-fetching.md)
  - [How to Create an E2E Test](./docs/e2e-testing.md)
  - [How to Style the UI](./docs/styling.md)

## Contributing

This is still a work in progress, however, if you are also an adventurous person, you can read the code and have some fun!

### How to develop

`graphql-js` package is cumbersome when using `yarn link` because it requires only one instance of the package and there are two.

To solve this problem you can deduplicate the instances by going into this project's `node_modules` and changing the file `node_modules/graphql/index.js` to:

```js
module.exports = require('<path/to/the/tenant.store/node_modules/graphql/index.js>')
```

## Packages

| Package                      | Description                                                                         |                                                                  Version                                                                   |
| :--------------------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------: |
| @vtex/gatsby-plugin-cms      | Connects the Store to our CMS solution                                              |      [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-cms.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-cms)      |
| @vtex/gatsby-plugin-graphql  | Builds and preprocess the store's GraphQL queries                                   |  [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-graphql.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-graphql)  |
| @vtex/gatsby-plugin-i18n     | Allows internationalization on Stores                                               |     [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-i18n.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-i18n)     |
| @vtex/gatsby-plugin-nginx    | Exports a Nginx configuration base on the Store's routes                            |    [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-nginx.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-nginx)    |
| @vtex/gatsby-plugin-theme-ui | Allows style theming on the Store                                                   | [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-theme-ui.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-theme-ui) |
| @vtex/gatsby-source-vtex     | Fetchs and exports ecommerce information from VTEX APIs                             |     [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-source-vtex.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-source-vtex)     |
| @vtex/gatsby-theme-store     | Creates the base infrastructure for the Store site                                  |     [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-theme-store.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-theme-store)     |
| @vtex/gatsby-plugin-thumbor  | Integrates thumbor service with gatsby-plugin-image                                  |     [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-thumbor.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-thumbor)     |
| @vtex/lighthouse-config      | Exports a Lighthouse CI configuration to allow automatic tests on each Pull Request |      [![npm version](https://badge.fury.io/js/%40vtex%2Flighthouse-config.svg)](https://badge.fury.io/js/%40vtex%2Flighthouse-config)      |
| @vtex/store-ui               | Exports basic Store components. Checkout our [storybook](https://storeui.netlify.app/)                                                      |               [![npm version](https://badge.fury.io/js/%40vtex%2Fstore-ui.svg)](https://badge.fury.io/js/%40vtex%2Fstore-ui)               |
| @vtex/store-sdk               | Exports basic logic hooks for creating your custom ecommerce                      |               [![npm version](https://badge.fury.io/js/%40vtex%2Fstore-sdk.svg)](https://badge.fury.io/js/%40vtex%2Fstore-sdk)               |


## Who's using FastStore?

These are the clients running in production with FastStore:

- [Marin Brasil](https://www.marinbrasil.com.br/)
- [Boticario](https://www.boticario.com/)
- [Carrefour](https://mercado.carrefour.com.br/)

## Troubleshooting

---

**Question:** I'm having errors while running/building a store. There are the following log `Cannot query field "vtexCms" on type "Query"` or an error with `Status Code 403`.

**Answer:** You need to log in VTEX by `vtex login <account>`

---

**Question:** I'm trying to add a dependency inside a specific package with `yarn add <package>`, but it's not working.

**Answer:** Each package has a workspace, so you need to add libraries like this: `yarn workspace <workspace> add <package>`
Example: `yarn workspace @vtex/store-ui add react-modal`

## Getting help

If you find any issues on the project you would like to report, please create an [issue](https://github.com/vtex/faststore/issues) on the repository. If you have a question, idea or want to show us something cool you have built, feel free to create a [discussion](https://github.com/vtex/faststore/discussions).
