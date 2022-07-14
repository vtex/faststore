# How to extend and customize native types

One of the major features the analytics module offers are its types. They're all based on [Google Analytics 4 (GA4) data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events), and they're especially focused on the [Enhanced Ecommerce](https://support.google.com/tagmanager/answer/6107169) capabilities.

Although the recommended parameters by each analytics providers are often the most important ones, it's quite common to send additional properties to them in order to monitor specific behaviors that are uniquely valuable to a store or a store segment.

The analytics module supports this behavior natively and offers ways to make it easy to incorporate it without losing code safety features. It does that by accepting custom types and exporting its own types so that users don't have the need to rewrite all of them to add minor additions. Also, these types are built with generics, which means you can rewrite only a small part of them if you really need to.

## Available types

The types for all events are available for use and extension. Here's the list of the events the analytics module natively supports: `add_payment_info`, `purchase`, `signup`, `add_shipping_info`, `refund`, `add_to_cart`, `remove_from_cart`, `view_cart`, `add_to_wishlist`, `search`, `view_item`, `begin_checkout`, `select_item`, `view_item_list`, `select_promotion`, `view_promotion`, `login`, `share`. For each of these events, at least two types are exported: one being the type of the event params and the other being the event type itself.

As an example, the `add_to_cart` has two exported types: `AddToCartParams<T extends Item = Item>` and `AddToCartEvent<T extends Item = Item>`.

Also, there are types there are common to all events, such as the `Item` type. These types are particulary useful when overriding `Item` properties or a whole `Item` itself (usually via generics).

## Extending types

You can extend the available types by using common TS techniques such as [Type Aliases or Extended Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces).

```ts
import type { AddToCartEvent } from '@faststore/sdk'

/**
 * AddToCartExtended will have all the AddToCartEvent properties (name, params) plus the new properties (foo)
 */
interface AddToCartExtended extends AddToCartEvent {
    foo: string
}
```

Also, when available, you can use [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) to override the Item property in events.


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
