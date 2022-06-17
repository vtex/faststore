---
title: FastStore - May 2022
description: FastStore Release Notes
tags: [faststore]
hide_table_of_contents: false
---

New OutOfStock and ProductCard components added to the FastStore UI. Also, improvements in the FastStore API now allow fetching additional properties of a product.

<!--truncate-->

## FastStore UI

### `OutOfStock`

- <p><span role="img" aria-label="chores">🎉</span><b>New <code>OutOfStock</code> component</b> - <a href="https://github.com/vtex/faststore/pull/1314">#1314</a></p>
  Use the <code>OutOfStock</code> component to display a subscription form for shoppers who want to be alerted when the product is back in stock.

![out-of-stock](https://user-images.githubusercontent.com/51174217/169893136-8834db12-af0b-4b64-9365-cce67368c094.png)

### `ProductCard`

- <p><span role="img" aria-label="chores">🎉</span><b>New <code>ProductCard</code> component</b> - <a href="https://github.com/vtex/faststore/pull/1272">#1272</a></p>
  Use the <code>ProductCard</code> component to provide a general view of a product, including images, name, price, discount, and buy button.

![product-card](https://user-images.githubusercontent.com/3356699/167171222-01edef9e-fe53-4910-ac41-7fd5329fcdfd.png)

## FastStore SDK

### `useStorage`

- <p><span role="img" aria-label="Enhancement">✨</span><b>Updated <code> hook</code> component</b> - <a href="https://github.com/vtex/faststore/pull/1316">#1316</a></p>
  The shopping cart is now persistent across the browser's tabs. Before, if two items were added to the cart through distinct tabs, the last item would always overwrite the prior one.

## FastStore API

### VTEX Platform

- <p><span role="img" aria-label="bug fix">🐛</span> <b>Top searches</b> - <a href="https://github.com/vtex/faststore/pull/1321">#1321</a></p>
  All requests to the FastStore Search API now receive locale info so the search can return product suggestions according to the user locale.

- <p><span role="img" aria-label="bug fix">🐛</span> <b>Fixed breadcrumb broken links</b> - <a href="https://github.com/vtex/faststore/pull/1306">#1306</a></p>
  Breadcrumb links that were broken have been fixed, allowing shoppers to navigate the website without getting 404 errors.

- <p><span role="img" aria-label="Enhancement">✨</span> <b>Support for querying additional properties of a product</b> - <a href="https://github.com/vtex/faststore/pull/1304">#1304</a></p>
  The FastStore API has been enhanced to support querying any additional property of a product.

- <p><span role="img" aria-label="Enhancement">✨</span> <b>Sync Cart with Checkout</b> - <a href="https://github.com/vtex/faststore/pull/1299">#1299</a></p>
  The behavior of the <code>validateCart</code> resolver has been modified. After placing an order, the cart is now cleared, and any changes made during checkout are reflected in the cart.

- <p><span role="img" aria-label="bug fix">🐛</span><b>The Search API now receives <code>selectedFacets</code> component</b> - <a href="https://github.com/vtex/faststore/pull/1297">#1297</a></p>
  Filtering search results according to the user's region has been fixed.

- <p><span role="img" aria-label="bug fix">🐛</span><b>Fixed promotion issues</b> - <a href="https://github.com/vtex/faststore/pull/1289">#1289</a></p>
  Promotions such as <i>Buy 2 Get 3</i> now work correctly.

- <p><span role="img" aria-label="bug fix">🐛</span><b>Fixed SKU offer issues</b> - <a href="https://github.com/vtex/faststore/pull/1282">#1282</a></p>
  Product offers related to a specific SKU have been fixed, and now the offers are available only for available SKUs.

- <p><span role="img" aria-label="bug fix">🐛</span><b>Fixed in the Serch API</b> - <a href="https://github.com/vtex/faststore/pull/1273">#1273</a></p>
  Suggestions are now working as expected.

## Internal

- <p><span role="img" aria-label="chores">🎉</span><b>Turborepo on FastStore</b> - <a href="https://github.com/vtex/faststore/pull/1296">#1296</a></p>
  The FastStore project now uses <a href="https://turborepo.org/">Turborepo</a>.

- <p><span role="img" aria-label="documentation">📑</span><b>New guide: Installing Releases on VTEX Headless CMS</b> - <a href="https://github.com/vtex/faststore/pull/1310">#1310</a></p>

- <p><span role="img" aria-label="documentation">📑</span><b><a href="https://www.faststore.dev/releases/2022/05/18/faststore">FastStore API documentation</a> available on GraphiQL</b> - <a href="https://github.com/vtex/faststore/pull/1305">#1305</a></p>
  FastStore API reference documentation is now available. For more information, refer to <a href="https://www.faststore.dev/releases/2022/05/18/faststore">this announcement</a>.

- <p><span role="img" aria-label="documentation">📑</span><b>Improved the descriptions of FastStore API</b> - <a href="https://github.com/vtex/faststore/pull/1303">#1303</a></p>

- <p><span role="img" aria-label="bug fix">🐛</span><b>Fixed styles and data attributes</b> - <a href="https://github.com/vtex/faststore/pull/1287">#1287</a></p>
  Styles used on the FastStore UI documentation have been updated after the <a href="https://github.com/vtex/faststore/pull/1093">adjustments to the data attributes</a>. 


## Starters

- <p><span role="img" aria-label="chores">🎉</span><b>New Community Starters</b></p> 
  Check out the new Community Starters, created and maintained by FastStore community members:
  <ul>
    <li><a href="https://www.faststore.dev/starters/beauty">Beauty Store</a>.</li>
    <li><a href="https://www.faststore.dev/starters/toy">Toy Store</a>.</li>
    <li><a href="https://www.faststore.dev/starters/pets">Pets Store</a>.</li>
  </ul>
