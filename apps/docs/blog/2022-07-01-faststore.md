---
title: FastStore - June 2022
description: FastStore Release Notes
tags: [faststore]
hide_table_of_contents: false
---

The FastStore UI now includes the `Hero` and `Dropdown` components. Also, the FastStore API was enhanced to better support page error handling. Global changes were also implemented to enable price range filtering on PLPs.

<!--truncate-->

## FastStore UI

### `Hero`

- 🎉 **New `Hero` component** - [#1336](https://github.com/vtex/faststore/pull/1336)

  The `Hero` component is a full-width banner presented on the above-the-fold section of a web page. It serves as the first glimpse of your brand's identity and messaging.

  ![Hero component](https://user-images.githubusercontent.com/3356699/171502985-c061ff47-09c2-4726-b7a5-9c3321236877.png)

### `AggregateRating`

- 🎉 **New `AggregateRating` component** - [#1386](https://github.com/vtex/faststore/pull/1386)

### `OutOfStock`

- ✨ **`OutOfStock`'s nested components now accept `otherProps`** - [#1341](https://github.com/vtex/faststore/pull/1341)
  
  The `OutOfStockTitle` and `OutOfStockMessage` components now accept additional data attributes through the `otherProps` attribute.

### `Slider`

- ✨ **Slider component enhanced** - [#1364](https://github.com/vtex/faststore/pull/1364)
 
  The `Slider` component now accepts an initial state out of the min/max domain. Also, the `onEnd` callback function was added to enable triggering effects after user interaction.

## FastStore API

### VTEX Platform

- 🎉 **Request error handling functionality added** - [#1361](https://github.com/vtex/faststore/pull/1361)

  The FastStore API now returns the proper page error code (`400` or `404`), allowing FastStore websites to respond to these errors accordingly.

- 🎉 **Canonical PDP slugs added** - [#1338](https://github.com/vtex/faststore/pull/1338)

  So that VTEX stores migrating to FastStore can work seamlessly, a 301 redirect between `vtexSlug` and `fastStoreSlug` was created, where:
    - `vtexSlug`: `/{slug}/p`
    - `fastStoreSlug`: `${slug}-${skuId}/p`

- ✨ **Resolvers and types updated to allow price range filtering on PLPs** - [#1364](https://github.com/vtex/faststore/pull/1364)
 
  The `search` query now receives `price`. Also, the `StoreFacetRange`, `StoreFacetBoolean`, `StoreFacetValueRange`, and `StoreFacetValueBoolean` types were created to allow price range filtering on PLPs.

- 🐛 **`validateCart` error for `additionalProperties` fixed** - [#1325](https://github.com/vtex/faststore/pull/1325)

  The following error `Field "propertyID" is not defined by type IStorePropertyValue.`, related to products with `additionalProperties` added to the cart, was fixed. 

- 🐛 **`AggregateOffer` resolver fixed for selecting the best seller** - [#1350](https://github.com/vtex/faststore/pull/1350)

  For SKUs sold by multiple sellers, the `AggregateOffer` resolver was not able to detect the best seller consistently. This issue was solved by making the `AggregateOffer` resolver return the lowest and highest prices according to the `bestOfferFirst` function.

- 🐛 **Test inconsistencies fixed** - [#1360](https://github.com/vtex/faststore/pull/1360)

  Test inconsistencies were resolved to provide a development environment more similar to the production one.

- 🧹 **FastStore API mocks updated to use auto fuzzy** - [#1359](https://github.com/vtex/faststore/pull/1359)

## FastStore SDK

- 🎉 **Full support to Trade Policies now available** - [#1319](https://github.com/vtex/faststore/pull/1319)

  The `Session` context provider now accepts a new function called `onValidateSession`, which calls the backend to validate the session. On any modification to the channel, such as logging in to the store, the session values (e.g., channel, person, language) are updated accordingly so the user can start browsing on the new session.

- ✨ **`useSearchState` updated to allow price range filtering on PLPs** - [#1364](https://github.com/vtex/faststore/pull/1364)
  
   The new `setState` function was added to the `useSearchState` context. All other `useSearchState` functions were removed and exported as helper functions. 

## Documentation

### 🎉 New

- [Playground](/playground)
- [FastStore API - Overview](/reference/api/faststore-api)
  - [FastStore API - Get Started](/reference/api/get-started)
  - [Queries](/reference/api/queries)
    - [`product`](/reference/api/queries/product)
    - [`allProducts`](/reference/api/queries/allProducts)
    - [`collection`](/reference/api/queries/collection)
    - [`allCollections`](/reference/api/queries/allCollections)
    - [`search`](/reference/api/queries/search)
  - [Mutations](/reference/api/mutations)
    - [`cart`](/reference/api/mutations/cart)
    - [`session`](/reference/api/mutations/session)
  - [Objects](/reference/api/objects)
  - [Inputs](/reference/api/inputs)
  - [Enums](/reference/api/enums)
  - [Scalars](/reference/api/scalars)
- [Troubleshooting FastStore](/how-to-guides/troubleshooting)
  - [Tracing the error source](/how-to-guides/troubleshooting/tracing-the-error-source)
- [Troubleshooting - VTEX Integration](/how-to-guides/platform-integration/vtex/troubleshooting)
- [Components Overview](/reference/ui/components)
  - [`Hero`](/reference/ui/organisms/Hero)
  - [`Dropdown`](/reference/ui/molecules/Dropdown)
  - [`OutOfStock`](/reference/ui/organisms/OutOfStock)
  - [`ProductCard`](/reference/ui/molecules/ProductCard)

### ✨ Improved

- [Configuring external DNS for a custom domain](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website)
- [Identifying development errors and Starter bugs](/how-to-guides/troubleshooting/identifying-development-errors-and-starter-bugs)
- [`Card`](/reference/ui/molecules/Card)
- [`Button`](/reference/ui/atoms/Button)

## Internal

- 🎉  **FastStore repository now uses Turborepo cache** - [#1330](https://github.com/vtex/faststore/pull/1330)

- 🎉 **FastStore repository now uses CodeQL analysis** - [#1331](https://github.com/vtex/faststore/pull/1331)

- ✨ **Codesandbox CI improved** - [#1357](https://github.com/vtex/faststore/pull/1357)

- 🧹 **Docs package removed from Codesandbox build** - [#1334](https://github.com/vtex/faststore/pull/1334)

- 🧹 **Circular dependencies removed from FastStore SDK** - [#1333](https://github.com/vtex/faststore/pull/1333)

- 🧹 **Purged unused CSS from the docs package** - [#1345](https://github.com/vtex/faststore/pull/1345)

- 🧹 **Typescript errors fixed** - [#1352](https://github.com/vtex/faststore/pull/1352)

- 🧹 **`tsconfig` package replaced by `shared`** - [#1379](https://github.com/vtex/faststore/pull/1379)

- 🧹 **Eslint configs improved** - [#1368](https://github.com/vtex/faststore/pull/1368)

- 🧹 **`build` script updated** - [#1362](https://github.com/vtex/faststore/pull/1362)

- 🧹 **Prettier configured** - [#1369](https://github.com/vtex/faststore/pull/1369)

- 🧹 **`outdir` added to all `tsconfig`** - [#1372](https://github.com/vtex/faststore/pull/1372)

- 🧹 **Packages' `module` field updated** - [#1374](https://github.com/vtex/faststore/pull/1374)
