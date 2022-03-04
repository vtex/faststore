---
title: February, 2022
description: FastStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---

# February, 2022

Adjustments in the `SearchInput` reference and `useStorage` hook. Fixes in `StoreProduct` values and trailing slash from incoming requests. Also, new Performance Budgets section to the lighthouse report.

<!--truncate-->

## FastStore UI

### SearchInput

- ✨ **Adjust `SearchInput` reference** - [#1153](https://github.com/vtex/faststore/pull/1153) The `SearchInput` component now uses imperative code for input behaviors. The [`useImperativeHandle` hook](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) is used to give the component control over the value that is returned by explicitly stating the return value.


## FastStore
### SDK
- ✨ **Stable `useStorage` hook** - [#1146](https://github.com/vtex/faststore/pull/1146) 
The `useStorage` hook is now stable, meaning that if there is no value stored on the persistent storage, the hook won't trigger a re-rendering of the React API. Instead, the `useStorage` will use the `initialValue`. This behavior leads to a smaller footprint of the user's device and smaller total blocking time (TBTs).

## FastStore API
### VTEX Platform
- 🐛 **Fix `allCollections` query pagination and pagetype timeout errors** - [#1140](https://github.com/vtex/faststore/pull/1140) 
The pagination of `allCollections` requests and timeouts during pagetype fetching were fixed.


- 🐛 **Fix PDP and PLP breadcrumb list item's URL paths** - [#1148](https://github.com/vtex/faststore/pull/1148)
Uppercase and spaces in PLP and PDP links used in the breadcrumb component have been fixed.

- ✨ **Moves some Filter logic to the API** - [#1154](https://github.com/vtex/faststore/pull/1154) 
Logic from the `Filter` component was moved from the frontend to the backend (API) to reduce processing on the frontend. Thus, the VTEX API can now sort the facets values alphabetically. Also, the `departamento` facet was removed from the PLP page.

- 🐛 **Fix `StoreProduct` returning wrong SKU** - [#1156](https://github.com/vtex/faststore/pull/1156) 
SKU IDs on accounts in which multiple SKUs are available for each product no longer retur incorrect `StoreProduct` values.

- 🐛 **Fix filter active brands** - [#1157](https://github.com/vtex/faststore/pull/1157) 
The `NotFoundError: Catalog returned FullText for slug: canyon.` error no longer occurs for cases where the API returns a list of brands containing inactive brands.

- 🐛 **Fix Cart item availability** - [#1160](https://github.com/vtex/faststore/pull/1160) 
Now, if a product has a limited inventory, the cart component limits the number of products the user can add to it. Also, if the user adds more items, a toast message is raised, warning the user.

## `gatsby-plugin-nginx`
- 🐛 **Remove trailing slash from incoming requests** - [#1145](https://github.com/vtex/faststore/pull/1145) 
Now, headers are properly set when a requested page has an exact match, but the request URL contains a trailing slash.

## `lighthouse-config`
- ✨ **Add performance budgets to `lighthouse config`** - [#1150](https://github.com/vtex/faststore/pull/1150) 
Now, the Lighthouse report includes a *Performance Budgets* section.
A [performance budget](https://web.dev/i18n/en/performance-budgets-101/) establishes limits on metrics that influence site performance.
