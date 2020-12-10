# FastStore 
## An open e-commerce framework

FastStore is an open e-commerce framework built using modern technologies that aims to deliver the building blocks necessary for creating your custom e-commerce experience. With these building blocks you can archieve:

- Multiregion stores with native internationalization support
- Great Performance (90+ on Google's page speed insights)
- SEO ready pages with Google's Rich Results support
- CMS managed content
- JAMStack based (deploy with Netlify, Vercell and any other JAMStack platform)
- Marketplace ready with support to millions of skus
- Intelligence via Google Analytics and GTM
- Evergreen stores with our no-fork based approach

## Why building FastStore ?
The web is a wild and noisy environment. Many projects clains to solve many different aspects of web development but none of them solves the e-commerce problem satisfactory. E-commerce is a very complex case where performance is a must, but personalization is the key. 

After years of developing e-commerces, FastStore creators packaged all of this knowledge into easy, ready to use building blocks for crafting production ready, multi-region marketplaces.

FastStore not only contains code, but knowledge and guidelines for changing you way of thinking and building e-commerces

## Project Philosofy
This project has a very well defined list of priorities. When solving an issue, a lower ranking priority must not degrade or override an upper ranking priority.
The priorities are:

1. Performance
2. Stability - e2e tests are complete and make sure the critical paths are covered
3. No fork - Features should be delivered by dependencies and not by a store fork
4. Feature completion

## Why JAMStack and Gatsby ?
The main points of JAMStack are performance and stability. This is very well aligned to our core philosofy. 

Gatsby has a very mature plugin system where the `No Fork` philosofy can be implemented via Gatsby Themes and Shadowing. Also, Gatsby is very aligned with performnance by implementing the PRPL architecture

## Continous Performance and Stability
Maintaining the FastStore performance and stability is a key element. For this, using Lighthouse CI and Cypress in your CI/CD pipeline is recommended. 

We provide base setup for both platforms so you can easily add then to you CI/CD platform

## Docs
We are still missing many docs and guides, however some of them are available at the `docs` folder. Available docs are:

- **Architecture**: learn more about this project's architecture
- **Component**: learn how to develop a reusable component

## Contributing
This is still a work in progress, however, if you are also a wild person, you can read the code and have some fun !

### How to develop
`graphql-js` package is cumbersome when using `yarn link` because it requires only one instance of the package and there are two.

To solve this problem you can deduplicate the instances by going into this project's `node_modules` and changing the file `node_modules/graphql/index.js` to

```js
module.exports = require('<path/to/the/tenant.store/node_modules/graphql/index.js>')
```

## Packages

| Package                      | Version  |
|:----------------------------:|:--------:|
| @vtex/gatsby-plugin-cms      | [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-cms.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-cms)
| @vtex/gatsby-plugin-graphql  | [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-graphql.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-graphql)
| @vtex/gatsby-plugin-i18n     | [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-i18n.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-i18n)
| @vtex/gatsby-plugin-nginx    | [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-nginx.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-nginx)
| @vtex/gatsby-plugin-theme-ui | [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-theme-ui.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-plugin-theme-ui)
| @vtex/gatsby-source-vtex     | [![npm version](https://badge.fury.io/js/%40vtex%2Fgatsby-source-vtex.svg)](https://badge.fury.io/js/%40vtex%2Fgatsby-source-vtex)
| @vtex/lighthouse-config      | [![npm version](https://badge.fury.io/js/%40vtex%2Flighthouse-config.svg)](https://badge.fury.io/js/%40vtex%2Flighthouse-config)
| @vtex/store-ui               | [![npm version](https://badge.fury.io/js/%40vtex%2Fstore-ui.svg)](https://badge.fury.io/js/%40vtex%2Fstore-ui)


## Who's using FastStore ?
These are the clients running in production with FastStore

- [Marin Brasil](https://www.marinbrasil.com.br/)
