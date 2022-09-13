---
title: FastStore - August 2022
description: FastStore Release Notes
tags: [faststore]
hide_table_of_contents: false
---

`Gift`, `OrderSummary`, `SkuSelector`, and `CartItem` components are now available in the FastStore UI. Also, updates to the FastStore API improve the shopping cart UX and allow adding user's session information to the `orderForm`.

## FastStore UI

### `Gift`

- 🎉 New component - [#1443](https://github.com/vtex/faststore/pull/1443)

  Use the `Gift` component to display promotional gift items.

  ![Gift component](https://vtexhelp.vtexassets.com/assets/docs/src/GiftComponent___9227a49f8eaa4747e9fa58ffea2aad17.png)

### `OrderSummary`
- 🎉 New component - [#1456](https://github.com/vtex/faststore/pull/1456)
  
    Use the `OrderSummary` component to provide a summary of the items in the cart, including the total price, related shipping tax, and discounts.

    ![OrderSummary component](https://vtexhelp.vtexassets.com/assets/docs/src/OrderSummary___899d24ce49b5586462c4d7baabf9a568.png)

### `SkuSelector`

- 🎉 New component - [#1462](https://github.com/vtex/faststore/pull/1462)
   
    Use the `SkuSelector` component on Product Details Pages (PDPs) to display all SKUs available for a given product.

    ![SkuSelector component](https://vtexhelp.vtexassets.com/assets/docs/src/SkuSelectorComp___c32d135f17c91d68f0d8e066584f3b5b.png)

### `CartItem`

- 🎉 New component - [#1461](https://github.com/vtex/faststore/pull/1461)
  
  Use the `CartItem` component to display summarized data about an item placed in the shopping cart. 

  ![CartItem component](https://vtexhelp.vtexassets.com/assets/docs/src/CardItemComp___04d7acdd464277c5dff0973a559ab836.png)

## FastStore API

- 🐛 Fixed "Buy 2 get 3" promotions - [#1434](https://github.com/vtex/faststore/pull/1434)
    
  Cart UX issues related to promotions, such as "Buy 2 get 3," have been fixed. Now, items and gifts are correctly combined when necessary.

  ![Cart discount](https://vtexhelp.vtexassets.com/assets/docs/src/PR1434___369ba827d37aacc483319ff35f970413.png)
   
- ✨ Product `releaseDate` now available - [#1438](https://github.com/vtex/faststore/pull/1438)
  
  The `StoreProduct` entity can now return the [`releaseDate`](https://schema.org/releaseDate) of an item.

- ✨ Session info now available as an argument of `validateCart`  - [#1444](https://github.com/vtex/faststore/pull/1444)

  The `validateCart` mutation now accepts the `session` argument. This allows adding the user's session information to the `orderForm`, making the shopping flow consistent between storefront and checkout, and allowing for regionalized prices.

## Documentation

- 🎉 New documentation feedback feature - [#1448](https://github.com/vtex/faststore/pull/1448)

  ![Documentation Feedback](https://vtexhelp.vtexassets.com/assets/docs/src/suggestedits___5ee5e891070ae257ef0ae9ffd99c2c49.gif)

### New and improved docs

- [FastStore, WebOps & Headless CMS Beta Program](/beta/about) - [#1446](https://github.com/vtex/faststore/pull/1446)
  - [Program overview and timeline](/beta/overview) - [#1446](https://github.com/vtex/faststore/pull/1446)
  - [Feedback and issue tracking](/beta/feedback-and-issue-tracking) - [#1446](https://github.com/vtex/faststore/pull/1446)
  - [Customer invitation](/beta/customer-invitation) - [#1446](https://github.com/vtex/faststore/pull/1446)
  - [Features and capabilities](/beta/features-and-capabilities) - [#1446](https://github.com/vtex/faststore/pull/1446)
  - [Changes from Store Framework](/beta/changes-from-store-framework) - [#1446](https://github.com/vtex/faststore/pull/1446)


- [Performance Overivew](/how-to-guides/performance) - [#1452](https://github.com/vtex/faststore/pull/1452) 
  - [Getting started with Lighthouse](/how-to-guides/performance/lighthouse) - [#1458](https://github.com/vtex/faststore/pull/1458)
  - [Analyzing a project's bundle size](/how-to-guides/performance/analyzing-a-projects-bundle-size) - [#1453](https://github.com/vtex/faststore/pull/1453)
  - [Testing the server-side rendering](/how-to-guides/performance/testing-the-server-side-rendering) - [#1458](https://github.com/vtex/faststore/pull/1458)

- FastStore API 
  - [Extending the GraphQL schema](/how-to-guides/faststore-api/extending-the-faststore-api) - [#1436](https://github.com/vtex/faststore/pull/1436) / [#1445](https://github.com/vtex/faststore/pull/1445)
  - [Using a GraphQL IDE to explore the FastStore API](/how-to-guides/faststore-api/explore-the-faststore-api) - [#1445](https://github.com/vtex/faststore/pull/1445) / [#1428](https://github.com/vtex/faststore/pull/1428/)
  - [Fetching API data on the storefront](/how-to-guides/faststore-api/fetching-api-data) - [#1445](https://github.com/vtex/faststore/pull/1445)
  
- [Analytics](/reference/sdk/analytics) - [#1449](https://github.com/vtex/faststore/pull/1449)
  - [`sendAnalyticsEvent`](/reference/sdk/analytics/sendAnalyticsEvent) - [#1449](https://github.com/vtex/faststore/pull/1449)
  - [`useAnalyticsEvent`](/reference/sdk/analytics/useAnalyticsEvent) - [#1449](https://github.com/vtex/faststore/pull/1449)
  - [Extending and customizing native types](/reference/sdk/analytics/how-to-extend-types) - [#1449](https://github.com/vtex/faststore/pull/1449)
  - [Sending custom events](/reference/sdk/analytics/how-to-send-custom-events) - [#1449](https://github.com/vtex/faststore/pull/1449)
  - [Analytics on FastStore](/conceptual-guides/analytics-on-faststore) - [#1449](https://github.com/vtex/faststore/pull/1449)
  - [Analytics on official starters](/conceptual-guides/analytics-on-official-starters) - [#1449](https://github.com/vtex/faststore/pull/1449)
  - [Analytics on Store Framework and FastStore comparison](/conceptual-guides/analytics-store-framework) - [#1449](https://github.com/vtex/faststore/pull/1449)
  
- [Glossary](/glossary) - [#1452](https://github.com/vtex/faststore/pull/1452) 