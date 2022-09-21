# FastStore SDK

FastStore SDK provides tools that help you deal with key ecommerce features:

- [Shopping cart](#shopping-cart)
- [Session](#session)
- [Search](#search)
- [Analytics](#analytics)

:::info
Note that the SDK manages these aspects of your store in the context of shoppers' browsers. This means, for example, that functions related to cart and session, do not necessarily send requests to the [FastStore API](/reference/api/faststore-api). In this case, the goal is to manage information in the browser, that can then be validated in the platform with the appropriate [mutations](/reference/api/mutations).
:::

Each of the features above has different properties and behaviors. Below you can learn more about each of them.

## Shopping cart

The SDK cart module controls the state of the shopping cart data structure in the shopper's browser. You can use them to add items to the cart, remove items, and clear the cart, among other tasks. Learn more about [shopping cart functions](/reference/sdk/cart/useCart).

:::info
Learn more about how to validate the cart in the shopper's browser against the information in the platform with [FastStore API mutations](/reference/api/mutations).
:::

## Session

The session module manages the state of session information in the shopper's browser. This includes currency, channel, localization and shopper data.

:::info
Learn more about how to validate session data in the shopper's browser against the data in the platform with [FastStore API mutations](/reference/api/mutations).
:::

## Search

FastStore faceted search is based on search URL parameters. Whenever a shopper searches your store or makes changes to the available facets selections, the SDK search module generates a unique and serialized URL, then directs the browser to that URL.

Learn more about how to use the [SDK search module](/reference/sdk/search) in your project.

## Analytics

The analytics module helps you create a simple and extensive event system to feed your data pool. It is biased towards Google Analytics 4 but supports any other analytics provider. Go to the [Analytics](/reference/sdk/analytics) page to learn more.
