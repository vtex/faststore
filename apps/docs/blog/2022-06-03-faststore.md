---
title: FastStore, May 2022
description: FastStoreStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---

## FastStore UI

### `OutOfStock`
- <span role="img" aria-label="chores">🎉</span> **New `OutOfStock` component** - [#1314](https://github.com/vtex/faststore/pull/1314) 
Use the `OutOfStock` component to display a subscription form for shoppers who want to be alerted when the product is back in stock.

![out-of-stock](https://user-images.githubusercontent.com/51174217/169893136-8834db12-af0b-4b64-9365-cce67368c094.png)

### `ProductCard`
- <span role="img" aria-label="chores">🎉</span> **New `ProductCard` component** - [#1272](https://github.com/vtex/faststore/pull/1272) 
Use the `ProductCard` component to provide a general view of a product, including images, name, price, discount, and buy button.

![product-card](https://user-images.githubusercontent.com/3356699/167171222-01edef9e-fe53-4910-ac41-7fd5329fcdfd.png)

## FastStore SDK
### `useStorage`
- <span role="img" aria-label="Enhancement">✨</span> **Updated `useStorage`** hook - [#1316](https://github.com/vtex/faststore/pull/1316)
The shopping cart is now persistent across the browser's tabs. Before, if two items were added to the cart through distinct tabs, the last item would always overwrite the prior one.

## FastStore API
### VTEX Platform

- <span role="img" aria-label="bug fix">🐛</span> **Top searches** - [#1321](https://github.com/vtex/faststore/pull/1321)
All requests to the FastStore Search API now receive locale info so the search can return product suggestions according to the user locale.

- <span role="img" aria-label="bug fix">🐛</span> **Fixed breadcrumb broken links** - [#1306](https://github.com/vtex/faststore/pull/1306)
Breadcrumb links that were broken have been fixed, allowing shoppers to navigate the website without getting 404 errors.

- <span role="img" aria-label="Enhancement">✨</span> **Support for querying additional properties of a product** - [#1304](https://github.com/vtex/faststore/pull/1304)
The FastStore API has been enhanced to support querying any additional property of a product.

- <span role="img" aria-label="Enhancement">✨</span> **Sync Cart with Checkout** - [#1299](https://github.com/vtex/faststore/pull/1299)
The behavior of the `validateCart` resolver has been modified. After placing an order, the cart is now cleared, and any changes made during checkout are reflected in the cart.

- <span role="img" aria-label="bug fix">🐛</span> **The Search API now receives `selectedFacets`** - [#1297](https://github.com/vtex/faststore/pull/1297)
Filtering search results according to the user's region has been fixed.

- <span role="img" aria-label="bug fix">🐛</span> **Fixed promotion issues** - [#1289](https://github.com/vtex/faststore/pull/1289)
Promotions such as *Buy 2 Get 3* now work correctly.

- <span role="img" aria-label="bug fix">🐛</span> **Fixed SKU offer issues** - [#1282](https://github.com/vtex/faststore/pull/1282)
Product offers related to a specific SKU have been fixed, and now the offers are available only for available SKUs.

- <span role="img" aria-label="bug fix">🐛</span> **Fixed in the Serch API** - [#1273](https://github.com/vtex/faststore/pull/1273)
Suggestions are now working as expected.


## Internal
- <span role="img" aria-label="chores">🎉</span> **Turborepo on FastStore** - [#1296](https://github.com/vtex/faststore/pull/1296)
The FastStore project now uses [Turborepo](https://turborepo.org/).

- <span role="img" aria-label="documentation">📑</span> **New guide: Installing Releases on VTEX Headless CMS** - [#1310](https://github.com/vtex/faststore/pull/1310)

- <span role="img" aria-label="documentation">📑</span> **[FastStore API documentation](https://www.faststore.dev/releases/2022/05/18/faststore) available on GraphiQL** - [#1305](https://github.com/vtex/faststore/pull/1305)
FastStore API reference documentation is now available. For more information, refer to [this announcement](https://www.faststore.dev/releases/2022/05/18/faststore).

- <span role="img" aria-label="documentation">📑</span> **Improved the descriptions of FastStore API** - [#1303](https://github.com/vtex/faststore/pull/1303)

- <span role="img" aria-label="bug fix">🐛</span> **Fixed styles and data attributes** - [#1287](https://github.com/vtex/faststore/pull/1287)
Styles used on the FastStore UI documentation have been updated after the [adjustments to the data attributes](https://github.com/vtex/faststore/pull/1093) of these components.
    
## Starters
- <span role="img" aria-label="chores">🎉</span> **New Community Starters** 
Check out the new Community Starters, created and maintained by FastStore community members:
    - [Beauty Store](https://www.faststore.dev/starters/beauty)
    - [Toy Store](https://www.faststore.dev/starters/toy)
    - [Pets Store](https://www.faststore.dev/starters/pets)
