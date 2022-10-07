---
id: analytics
---

# Analytics

The Analytics module is responsible for managing events on a website. The module is composed of two main functions:

- `sendAnalyticsEvent` - fires events in the browser. When you fire an event using this function, the event is only shared with the website's origin. The event is wrapped and sent to the [Window object](https://developer.mozilla.org/en-US/docs/Web/API/Window) over standard `postMessage` calls. 
- `useAnalyticsEvent` - intercepts fired events and usually communicates with an analytics provider.

![Analytics module](https://vtexhelp.vtexassets.com/assets/docs/src/analyticsmodule___37ad6fdb1e969835206b6d4b91461529.png)

:::caution
Events sent via the Analytics module are not directly sent to any analytics provider (e.g., Google Analytics). This configuration can be done manually with the [`useAnalyticsEvent`](/reference/sdk/analytics/useAnalyticsEvent) hook.
:::

The Analytics module supports sending and receiving events of any shape, so you can implement your own types and override default ones.

Another central feature of the Analytics module is [Enhanced Ecommerce](https://support.google.com/tagmanager/answer/6107169)-focused types based on [Google Analytics 4 (GA4) data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).

## List of types

The Analytics SDK comes with native types based on Enhance Ecommerce. All event types are available for use and extension. Here's the list of the events the analytics module natively supports: 

|Type|Description|
|------------------|-----------------|
|`add_payment_info`|Receives `currency`, `value`, `coupon`, `payment_type`, and `items` params.|
|`add_shipping_info`|Receives `currency`, `value`, `coupon`, `shipping_tier`, and `items` params.|
|`add_to_cart`|Receives `currency`, `value`, and `items` params.|
|`add_to_wishlist`|Receives `currency`, `value`, and `items` params.|
|`begin_checkout`|Receives `currency`, `value`, `coupon`, and `items` params.|
|`login`|Receives the `method` param.|
|`purchase`|Receives `currency`, `transaction_id`, `value`, `affiliation`, `coupon`, `shippinh`, `tax` and `items` params.|
|`remove_from_cart`|Receives `currency`, `value`, and `items` params.|
|`search`|Receives the `search_term` param.|
|`select_item`|Receives `item_list_id`, `item_list_name`, and `items` params.|
|`select_promotion`|Receives `item_list_id`, `item_list_name`, and `items` params.|
|`share`|Receives `method`, `content_type`, and `item_id` params.|
|`signup`|Receives `method`, `content_type`, and `item_id` params.|
|`view_cart`|Receives `currency`, `value`, and `items` params.|
|`view_item`|Receives `currency`, `value`, and `items` params.|
|`view_item_list`|Receives `item_list_id`, `item_list_name`, and `items` params.|
|`view_promotion`|Receives the `items` params.|

Each of these events exports at least two types: the type of the event params and the event type itself.

As an example, the `add_to_cart` has two exported types: `AddToCartParams<T extends Item = Item>` and `AddToCartEvent<T extends Item = Item>`.

Also, some types are [common](https://github.com/vtex/faststore/blob/main/packages/sdk/src/analytics/events/common.ts) to all events, such as the `Item` type. These types are particularly useful when overriding `Item` properties or a whole `Item` itself.

## Google Analytics 4

Google Analytics is by far the industry-leading analytics solution that most ecommerce websites use, and the Analytics module was built with it in mind. All the module's helper functions and hooks use the [Google Analytics 4 (GA4) data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) by default. This way, you can use a [code hinting](#code-hinting) tool to receive suggestions of GA4 events along with their recommended properties while coding.

To send the events to Google Analytics, you'll need to use the [`useAnalyticsEvent`](/reference/sdk/analytics/useAnalyticsEvent) hook. The hook must listen to events from `sendAnalyticsEvents` and add them to the `dataLayer` (for Google Tag Manager - recommended) or call the `gtag` function directly (for gtag script implementations).

## Code hinting

Leveraging from the Analytics module's type definitions, you can use [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) suggestions for code hinting.

![IntelliSense](https://vtexhelp.vtexassets.com/assets/docs/src/intellisense___9ad25b66da6ed2e1bc14e26d09baa40e.png)