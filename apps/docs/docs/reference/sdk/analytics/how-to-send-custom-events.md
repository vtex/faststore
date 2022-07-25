# How to send custom events

Sometimes a store needs to track user behavior that's not covered by [GA's Enhanced Ecommerce](https://support.google.com/tagmanager/answer/6107169), which is natively supported by the analytics module. In those cases, you can still use the same functions and hooks to fire and intercept custom events. This way, you centralize all tracking-related events in a single tool, which helps you write code that's more consistant, readable, and maintainable.

## sendAnalyticsEvent
You can use [extended types](/reference/sdk/analytics/how-to-extend-types) for sending custom events. You'll need to use the generics available on the [sendAnalyticsEvent](/reference/sdk/analytics/sendAnalyticsEvent) function.

```ts
import type { AddToCartEvent } from '@faststore/sdk'
import { sendAnalyticsEvent } from '@faststore/sdk'

interface AddToCartExtended extends AddToCartEvent {
    foo: string
}

/* ... */

sendAnalyticsEvent<AddToCartExtended>({ name, params, foo })
```

### Send arbitrary event
The `sendAnalyticsEvent` function demands that the event object contains two properties: `name` and `params`. `name` has to be a string and don't have to follow any event name conventions related to the natively supported events, while `params` can be of any type and value.

```ts
import { sendAnalyticsEvent } from '@faststore/sdk'

interface ArbitraryEvent {
    name: 'arbitrary-event',
    params: string
    foo: number
    bar: boolean
}

/* ... */

sendAnalyticsEvent<ArbitraryEvent>({ name, params, foo, bar })
```

### Override multiple types
If you have multiple types to override, you can do that all at once and re-export the `sendAnalyticsEvent` function with the desired types:

```ts
/* types.ts */
import { sendAnalyticsEvent } from '@faststore/sdk'

type AddToCartExtended = /* ... */
type RemoveFromCartExtended = /* ... */
type ViewItemExtended = /* ... */
type SelectItemExtended = /* ... */

type ExtendedEvents =
  | AddToCartExtended
  | RemoveFromCartExtended
  | ViewItemExtended
  | SelectItemExtended

type SendExtendedAnalyticsEvent = (event: ExtendedEvents) => void

export const sendExtendedAnalyticsEvent: SendExtendedAnalyticsEvent = (event) =>
  sendAnalyticsEvent<ExtendedEvents>(event)
```

```ts
/* MyComponent.tsx */
import { sendExtendedAnalyticsEvent } from './types'

/* ... */

sendExtendedAnalyticsEvent({ /* Extended event object */})
```

## useAnalyticsEvent

To target extended properties of events when intercepting them, you can configure the types of your [useAnalyticsEvent](/reference/sdk/analytics/useAnalyticsEvent) callback function to expect an event of such type.

```ts
import { useAnalyticsEvent } from '@faststore/sdk'

import type { ExtendedEvents } from './types'

export const AnalyticsHandler = () => {
  /**
   * By typing the callback function with the extended types, you are able to
   * reference properties that are not natively offered by the analytics module.
   */
  useAnalyticsEvent((event: ExtendedEvents) => {
    /* ... */
  })

 /* ... */

  return null
}
```