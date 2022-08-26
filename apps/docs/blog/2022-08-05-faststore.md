---
title: FastStore - July 2022
description: FastStore Release Notes
tags: [faststore]
hide_table_of_contents: false
---

The `search` query has been enhanced to allow cross-selling and upselling of products. Also, the new `subscribeToNewsletter` mutation is now available in the FastStore API. In the FastStore UI, the `Slider` and `PriceRange` components now allow ref forwarding.

<!--truncate-->

## FastStore UI

### `ProductTitle`

- 🎉 **New component** - [#1418](https://github.com/vtex/faststore/pull/1418)

  Use the `ProductTitle` component to display a header with product details, such as its name, reference number, and labels.

  ![Product Title component](https://vtexhelp.vtexassets.com/assets/docs/src/producttitle___0a29d592679adf54721515294a9bd279.png)

- ✨ **`ProductTitle` now uses ref forwarding** - [#1427](https://github.com/vtex/faststore/pull/1427)

  The `ProductTitle` component allows passing a previously received ref further down to a child.

### `PriceRange`

- ✨ **`PriceRange` now uses ref forwarding for min and max inputs** - [#1380](https://github.com/vtex/faststore/pull/1380)

  The `PriceRange` component now accepts receiving refs for both min and max inputs. With the ref forwarding technique, other components using the `PriceRange` can trigger input functions and control the min and max values of `PriceRange`.

- ✨ **New `PriceRange` look and feel** - [#1400](https://github.com/vtex/faststore/pull/1400)

  The `PriceRange` component now displays the min/max values centered above the `Slider`'s thumbs and allows for more customizations.

- 🐛 **`PriceRange` track position fixed** - [#1404](https://github.com/vtex/faststore/pull/1404)

  The track position of the `PriceRange` component has been adjusted for maximum absolute values greater than a hundred.

### `Slider`

- ✨ **`Slider` now uses ref forwarding for min and max inputs** - [#1380](https://github.com/vtex/faststore/pull/1380)

  The `Slider` component now accepts receiving refs for both min and max inputs. With the ref forwarding technique, other components using the `Slider` can trigger input functions and control the min and max values of `Slider`.

- ✨ **New prop added to `Slider`** - [#1415](https://github.com/vtex/faststore/pull/1415)

  The `Slider` component now includes the `step` prop that allows specifying the interval between the input values.

- 🐛 **`Slider` values are now rounded** - [#1417](https://github.com/vtex/faststore/pull/1417)
  The `Slider` component now displays only rounded values.

- 🐛 **`Slider` thumb elements repositioned** - [#1423](https://github.com/vtex/faststore/pull/1423)

  The `Slider` thumb elements' have been repositioned in the DOM so they can have customized behavior states.

## FastStore API

- 🧹 **Generated schema types updated** - [#1413](https://github.com/vtex/faststore/pull/1413)/[#1431](https://github.com/vtex/faststore/pull/1431)

  The generated TS types from the GraphQL schema have been updated.

### VTEX Platform

- 🎉 **Support for Cross Selling now available** - [#1396](https://github.com/vtex/faststore/pull/1396)

  The following facets have been added to the existing `Search` query in order to allow cross-selling and upselling products:

  - `buy`
  - `view`
  - `similars`
  - `viewAndBought`
  - `accessories`
  - `suggestions`

- 🎉 **New `subscribeToNewsletter` mutation available** - [#1385](https://github.com/vtex/faststore/pull/1385)

  The new `subscribeToNewsletter` mutation allows stores to save data to their MasterData newsletter list.

- 🎉 **New `skuSelector`-related properties added to `ProductGroup`** - [#1407](https://github.com/vtex/faststore/pull/1407)

  The `ProductGroup` type now includes the `skuVariations` attribute, which brings with it four new properties:

  - `allVariantsByName` - Returns all available options for each SKU variant property, indexed by their name.
  - `slugsMap` - Returns the slug for the SKU that matches the currently selected product variations.
  - `activeVariations` - Returns the property values for the current SKU.
  - `availableVariations` - Returns the available options for each varying SKU property, considering the `dominantVariantName` property.

  These new properties allow users to query data about SKU specification variants more quickly and are especially handy for implementing SKU Selector components.

- 🐛 **`StoreOffer` resolver fixed** - [#1399](https://github.com/vtex/faststore/pull/1399)

  The `priceCurrency` field from `StoreOffer` now grabs the same info from the current context's sales channel and fetches the correct price currency value.

- 🐛 **Missing Catalog page types now available** - [#1411](https://github.com/vtex/faststore/pull/1411)

  The FastStore API now supports the following page types: `SubCategory`, `Collection`, `Cluster`. This should enable stores to render pages that match those types without issues.

- 🐛 **Issues related to Collection pages fixed** - [#1429](https://github.com/vtex/faststore/pull/1429)

  Issues when trying to fetch the `StoreCollection.breadcrumbList` field for Collection pages have been fixed. Before detecting the page type of a certain route, the `slufigyRoot` function now checks if the page is a Collection one.

## FastStore SDK

- 🧹 **Refactored SDKs' code** - [#1392](https://github.com/vtex/faststore/pull/1392)

  The FastStore SDK package has been refactored in order to remove all React dependencies.

## Documentation

### 🎉 New

**Analytics SDK**

- [Analytics](/reference/sdk/analytics) - [#1393](https://github.com/vtex/faststore/pull/1393)/[#1419](https://github.com/vtex/faststore/pull/1419)
  - [How to extend and customize native types](/reference/sdk/analytics/how-to-extend-types) - [#1393](https://github.com/vtex/faststore/pull/1393)
  - [How to send custom events](/reference/sdk/analytics/how-to-send-custom-events) - [#1393](https://github.com/vtex/faststore/pull/1393)
  - [`sendAnalyticsEvent`](/reference/sdk/analyticssendAnalyticsEvent) - [#1393](https://github.com/vtex/faststore/pull/1393)/[#1419](https://github.com/vtex/faststore/pull/1419)
  - [`useAnalyticsEvent`](/reference/sdk/analytics/useAnalyticsEvent) - [#1393](https://github.com/vtex/faststore/pull/1393)/[#1419](https://github.com/vtex/faststore/pull/1419)
- [Troubleshooting Analytics and Partytown](/how-to-guides/troubleshooting/analytics-and-partytown) - [#1397](https://github.com/vtex/faststore/pull/1397)
- [Analytics on FastStore](/conceptual-guides/analytics-on-faststore) - [#1405](https://github.com/vtex/faststore/pull/1405)
- [Analytics on official starters](/conceptual-guides/analytics-on-official-starters) - [#1405](https://github.com/vtex/faststore/pull/1405)

**UI**

- [`AggregateRating`](/reference/ui/molecules/AggregateRating) - [#1395](https://github.com/vtex/faststore/pull/1395)

**API**

- [Using GraphiQL to explore the FastStore API](/how-to-guides/faststore-api/explore-the-faststore-api) - [#1390](https://github.com/vtex/faststore/pull/1390)
- [Fetching API data on the storefront](/how-to-guides/faststore-api/fetching-api-data) - [#1403](https://github.com/vtex/faststore/pull/1403)

**VTEX Headless CMS**

- [VTEX Headless CMS Widgets](/how-to-guides/cms/vtex-headless-cms/Widgets) - [#1401](https://github.com/vtex/faststore/pull/1401)

### ✨ Improved

- [Configuring external DNS for a custom domain](how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website) - [#1406](https://github.com/vtex/faststore/pull/1406)/[#1422](https://github.com/vtex/faststore/pull/1422)
- [FasStore API overview](/reference/api/faststore-api) - [#1366](https://github.com/vtex/faststore/pull/1366)
- [Extending the GraphQL schema](/how-to-guides/faststore-api/extending-the-faststore-api) - [#1416](https://github.com/vtex/faststore/pull/1416)
- [Using GraphiQL to explore the FastStore API](/how-to-guides/faststore-api/explore-the-faststore-api) - [#1428](https://github.com/vtex/faststore/pull/1428) / [#1432](https://github.com/vtex/faststore/pull/1432)

## Internal

- 🐛 **`@faststore/graphql-utils` now uses the `commonjs` module** - [#1394](https://github.com/vtex/faststore/pull/1394)

- 🧹 **Improved Git blame view** - [#1409](https://github.com/vtex/faststore/pull/1409)

- 🧹 **`@store-framework` removed from CODEOWNERS** - [#1410](https://github.com/vtex/faststore/pull/1410)

- 🧹 **Wrong references to package names fixed** - [#1414](https://github.com/vtex/faststore/pull/1414)

- 🧹 **Auto-generated changelog fixed** - [#1425](https://github.com/vtex/faststore/pull/1425)

- 🧹 **Broken documentation links fixed** - [#1424](https://github.com/vtex/faststore/pull/1424)/[#1430](https://github.com/vtex/faststore/pull/1430)

- 🧹 **Changelog configs fixed** - [#1426](https://github.com/vtex/faststore/pull/1426)
