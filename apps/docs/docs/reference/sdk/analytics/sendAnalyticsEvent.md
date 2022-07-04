# sendAnalyticsEvent

The analytics module provides the `sendAnalyticsEvent` function as the way to fire events in the browser. These events are often related to ecommerce tracking capabilities. By default, the `sendAnalyticsEvent` suggests (via IntelliSense) and inforces (via TypeScript) [Google Analytics 4 (GA4) data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).

`sendAnalyticsEvent` does not send events to any analytics provider. It is merely a way to centralize and aggregate tracking events. To intercept events fired with this function, use the hook [useAnalyticsEvent](/reference/sdk/analytics/useAnalyticsEvent). This function also supports [sending custom events](/reference/sdk/analytics/how-to-send-custom-events).

## How to use

To fire a supported GA4 event:

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

## Generics

The `sendAnalyticsEvent` function was built using [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), which means you can extend default types and override the default ones, obtaining the same suggestions and enforcements as you would with a natively supported event.

To provide a custom type referecence for `sendAnalyticsEvent`, do the following

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

This is most commonly used to fire custom events or native events with custom properties in it. For more details, read the [How to extend and customize native types](/reference/sdk/analytics/how-to-extend-types) and [How to send custom events](/reference/sdk/analytics/how-to-send-custom-events) docs.
