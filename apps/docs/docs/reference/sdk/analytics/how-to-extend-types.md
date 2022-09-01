---
sidebar_position: 3
---

# Extending and customizing native types

The Analytics module offers multiple types based on the [Google Analytics 4 (GA4) Enhanced Ecommerce](https://support.google.com/tagmanager/answer/6107169) [data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events). Yet, although these are often the most used parameters on online stores, sending them additional properties is usually desirable in order to monitor specific behaviors that are only valuable to particular business models.

Extending and customizing native types from the Analytics SDK is natively supported by FastStore. The Analytics module can accept new types and also export its native types. This means you don't need to rewrite all the code of an event interface to add minor additions to it. Also, because the Analytics module is built with [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), you can rewrite only a tiny portion of a type if necessary.

In the following step by step, you'll learn how to extend and customize native types from the Analytics module.

## Step by step

Check the list of [Available types](/reference/sdk/analytics#available-types) that you can extend. Then, use [Type Aliases or Extended Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) TypeScript techniques to extend the desired type.

Take the following example where the `AddToCartEvent` interface is extended to also accept the `foo` property:

```ts
import type { AddToCartEvent } from '@faststore/sdk'

/**
 * AddToCartExtended will have all the AddToCartEvent properties (name, params) plus the new properties (foo)
 */
interface AddToCartExtended extends AddToCartEvent {
    foo: string
}
```

Also, when available, you can use [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) to override the `Item` property in events.

```ts
import type { AddToCartEvent, Item } from '@faststore/sdk'

interface ItemExtension {
  dimension10: string
}

type ItemExtended = Item & ItemExtension

/**
 * AddToCartExtended will have the same properties as AddToCartEvent (name, params), but the items inside the params property will now have the ItemExtended type.
 */
type AddToCartWithExtendedItems = AddToCartEvent<ItemExtended>
```
