---
toc_max_heading_level: 4
---

# Sending custom events

Even though the Analytics module supports [GA's Enhanced Ecommerce](https://support.google.com/tagmanager/answer/6107169) by default, a store may occasionally need to monitor customer activity not covered by the Analytics module. In these cases, it is still possible to use the [`sendAnalyticsEvent`](/sendAnalyticsEvent) and [`useAnalyticsEvent`](/useAnalyticsEvent) utils to fire and intercept custom events.

:::tip
We strongly recommend using the Analytics module to send custom events. This will help you centralize all tracking-related events in a single tool and, consequently, write more consistent, readable, and maintainable code.
:::

In the following step by step, you'll learn how to define and send custom events.

## Step by step 

### Step 1 - Declaring an interface for your custom event

To fire a custom event, you first need to declare an interface that describes the structure of your event object, including all its properties and types. To do that, you can

- [Create a new event interface.](#creating-a-new-event-interface)
  
- [Extend existing types from the Analytics module.](#extending-existing-types-from-the-analytics-module)
  
- [Override multiple types.](#overriding-multiple-types)

#### Creating a new event interface

You can use the `sendAnalyticsEvent` function to create a custom event interface. This function demands that the event contains two properties: 
- `name` (`string`)- name of the event presented in Analytics reports. The `name` doesn't need to follow any event name conventions related to natively supported events.
- `params` (`any`) - Any type and value used by your custom event.

Take the following example of an arbitrary event:

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

#### Extending existing types from the Analytics module

If your event is related to an existing one, you can [extended existing types](/reference/sdk/analytics/how-to-extend-types) from the Analytics module by using the [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) available on the [`sendAnalyticsEvent`](/reference/sdk/analytics/sendAnalyticsEvent) function.

Take the following example where the `AddToCartEvent` interface is extended to also accept the `foo` property:

```ts
import type { AddToCartEvent } from '@faststore/sdk'
import { sendAnalyticsEvent } from '@faststore/sdk'

interface AddToCartExtended extends AddToCartEvent {
    foo: string
}

/* ... */

sendAnalyticsEvent<AddToCartExtended>({ name, params, foo })
```

#### Overriding multiple types

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

### Step 2 - Intercepting custom events

After creating or extending an event interface, you'll need to intercept these events using the `useAnalyticsEvent` hook. You can do that as in the following:

```ts
import { useAnalyticsEvent } from '@faststore/sdk'

import type { ArbitraryEvent } from './types'

export const AnalyticsHandler = () => {
  useAnalyticsEvent((event: ArbitraryEvent) => {
  })

 /* ... */

  return null
}
```

Also, notice that to target extended properties of events, you'll also need to configure the types of your [`useAnalyticsEvent`](/reference/sdk/analytics/useAnalyticsEvent) callback function in order to expect an event of such type.

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

### Step 3 - Firing custom events

Now that you have declared your event interface and intercepted them with the `useAnalyticsEvent` hook, you can implement it in your components to fire the event when desired.

```ts
import { useCallback } from 'react'
import { sendAnalyticsEvent } from '@faststore/sdk'

const MyComponent = () => {
  const arbitraryEvent = useCallback(() => {
    /* ... */

    const arbitraryEvent = {
      type: 'arbitrary-event',
      data: {
        items: [
          /* ... */
        ],
      },
    }

    sendAnalyticsEvent(arbitraryEvent)
  }, [])

  return <button onClick={arbitraryEvent}>Arbitrary button</button>
}
```