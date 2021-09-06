## Cart

The analytics module lets you manage analytics events based on Google Analytics 4 (GA4) data model. The events are wrapped and sent over standard `postMessage` calls, that shares the event only with the website's origin. The events are received via event listeners. It also supports sending and receiving custom events as the types on the helper functions can be overriden.

### Sending events

Analytics events can be sent by using the `sendAnalyticsEvent` function and it's specially useful to send common ecommerce events such as `add_to_cart`. It enforces standard GA4 events via typecheck and intellisense suggestions, but this behavior can be altered via by overriding the function's types.

To fire a standard GA4 event:
```tsx
import { useCallback } from 'react'
import { sendAnalyticsEvent } from '@vtex/store-sdk'

const MyComponent = () => {
  const addToCartCallback = useCallback(() => {
    /* ... */
    
    const addToCartEvent = {
      type: 'add_to_cart',
      data: {
        items: [
          /* ... */
        ]
      }
    }

    sendAnalyticsEvent(addToCartEvent)
  }, [])

  return <button onClick={addToCartCallback}>Add to cart</button>
}
```

For custom events, define the type of the event and override the default type via `sendAnalyticsEvent` generics. Your custom event has to have a type and a data field of any kind.

To fire a custom event:

```tsx
import { useCallback } from 'react'
import { sendAnalyticsEvent } from '@vtex/store-sdk'

interface CustomEvent {
  type: 'custom_event',
  data: {
    customProperty?: string
  }
}

const MyComponent = () => {
  const customEventCallback = useCallback(() => {
    /* ... */
    
    const customEvent = {
      type: 'custom_event',
      data: {
        customProperty: 'value'
      }
    }

    sendAnalyticsEvent<CustomEvent>(customEvent)
  }, [])

  return <button onClick={customEventCallback}>Press here</button>
}
```

### Receiving events

It's possible to receive analytics events by using the `useAnalyticsEvent` hook. It accepts a handler that will be called everytime an event sent by `sendAnalyticsEvent` arrives. For that reason it can fire both for standard GA4 events and for custom events that a library or a component might be sending. To help users be aware of that possibility, the event received by the handler is, by default, typed as `UnknownEvent`. You can assume it has another type by simply typing the callback function as you wish, but be careful with the unforseen events that might come to this handler.

To use the `useAnalyticsEvent` hook:

```tsx
import { useAnalyticsEvent } from '@vtex/store-sdk'
import type { AnalyticsEvent } from '@vtex/store-sdk'

/**
 *  Notice that we typed it as AnalyticsEvent, but there may be events that are not from this type.
 * 
 *  Since we're dealing with it on a switch and we are providing an empty default clause,
 *  we're not gonna have issues receiving custom events sent by other components or libraries.
 */
function handler(event: AnalyticsEvent) {
  switch(event.type) {
    'add_to_cart': {
      /* ... */
    }

    /* ... */
    
    default:
  } 
}

// In your component:
const MyComponent = () => {
  useAnalyticsEvent(handler)

  /* ... */
}
```
