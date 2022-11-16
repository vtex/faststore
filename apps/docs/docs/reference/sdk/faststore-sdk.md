# FastStore SDK

FastStore SDK provides functions and interfaces for managing the state of key ecommerce features in the browser context. This means, for instance, handling the number of items in the cart and the user session's location.

It comprises four modules, each with specific properties and behaviors. Click the links below to learn more about each of them.

- [Shopping cart](#shopping-cart)
- [Session](#session)
- [Search](#search)
- [Analytics](#analytics)

## Shopping cart

The Cart module controls the state of the shopping cart data structure in the shopper's browser. You can use them to add items to the cart, remove items, and clear the cart, among other tasks. Learn more about [shopping cart functions](/reference/sdk/cart/useCart).

:::info
Learn more about how to validate the cart in the shopper's browser against the information in the platform with [FastStore API mutations](/reference/api/mutations).
:::

## Session

The Session module manages the state of session information in the shopper's browser. This includes currency, channel, localization and shopper data. Learn more about the [session SDK module](/reference/sdk/session) data structure and usage.

:::info
Learn more about how to validate session data in the shopper's browser against the data in the platform with [FastStore API mutations](/reference/api/mutations).
:::

## Search

The Search module offers functions for implementing a faceted search based on URL parameters. Whenever a shopper searches your store or changes the selected facets, the search module generates a unique and serialized URL, then directs the user to that URL.

Learn more about how to use the [SDK Search module](/reference/sdk/search) in your project.

## Analytics

The Analytics module helps you create a simple and extensive event system to feed your data pool. It is biased towards Google Analytics 4 but supports any other analytics provider. Go to the [Analytics](/reference/sdk/analytics) page to learn more.
