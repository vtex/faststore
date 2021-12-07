---
id: overview
---

# FastStore

These  libraries are located on the faststore monorepo and are:

## FastStore UI

@faststore/ui: Basic UI primitives built on atomic design focused on accessibility compliance compatible with any CSS solution (css-modules, tailwind, tachyons, emotion, styled-components)

## FastStore SDK

@faststore/sdk: Website global states, like:
- Cart: addItemToCart, removeFromCart, itemsOnCart 
- Session: userId, channel, locale
- Search: selected facets, sorting, search term
- UI: toggle minicart, show toast,

## FastStore API

@faststore/api: GraphQL API between the store and your favorite ecommerce platform.