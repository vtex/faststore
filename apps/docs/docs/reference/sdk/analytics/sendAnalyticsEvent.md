---
sidebar_position: 0
---

# sendAnalyticsEvent

The `sendAnalyticsEvent` function is responsible for firing events in the browser. These events enforce [Google Analytics 4 (GA4) data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) and are often related to ecommerce-tracking capabilities.

The `sendAnalyticsEvent` function centralizes and aggregates tracking events and also supports [custom events](/reference/sdk/analytics/how-to-send-custom-events).

:::caution
`sendAnalyticsEvent` does not send events to any analytics provider. To intercept events fired by this function, use the [`useAnalyticsEvent`](/reference/sdk/analytics/useAnalyticsEvent) hook. 
:::

## Import

```tsx
import { sendAnalyticsEvent } from '@faststore/sdk'
```

## Usage

In the component related to the event, declare a callback function. In this function, define an event object with the desired event type (e.g., `add_to_cart`) and call the `sendAnalyticsEvent`. Then, pass the related event as an argument. Finally, call the callback function in the event trigger (e.g., `onClick`).

Take the following example of an `add_to_cart` event triggered by the `button` component:

```tsx
import { useCallback } from 'react'
import { sendAnalyticsEvent } from '@faststore/sdk'

const MyComponent = () => {
  const addToCartCallback = useCallback(() => {
    /* ... */

    const addToCartEvent = {
      type: 'add_to_cart',
      data: {
        items: [
          /* ... */
        ],
      },
    }

    sendAnalyticsEvent(addToCartEvent)
  }, [])

  return <button onClick={addToCartCallback}>Add to cart</button>
}
```

Check the list of Available types [here](/reference/sdk/analytics#available-types).

## Generics

The `sendAnalyticsEvent` function was built using [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html). That means it's possible to extend default types and override the native ones, obtaining the same suggestions and enforcements as you would with a natively supported event.

Take the following example of providing a custom type reference for `sendAnalyticsEvent`:

```tsx
import { sendAnalyticsEvent } from '@faststore/sdk'

interface CustomEvent {
  name: 'custom_event'
  params: {
    customProperty?: string
  }
}

/**
 * We're passing the CustomEvent to sendAnalyticsEvent. As you type, you'll receive code suggestions for all the properties of this type, including params subfields.
 */
sendAnalyticsEvent<CustomEvent>(/* ... */)
```

This is most commonly used to fire custom or native events with custom properties in it. For more details, please refer to the [Extending and customizing native types](/reference/sdk/analytics/how-to-extend-types) and [Sending custom events](/reference/sdk/analytics/how-to-send-custom-events) guides.
