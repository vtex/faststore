---
sidebar_position: 1
---

# useAnalyticsEvent

The `useAnalyticsEvent` hook is responsible for intercepting both native and custom events fired by the [`sendAnalyticsEvent`](/reference/sdk/analytics/sendAnalyticsEvent) function. The hook automatically detects which events were sent by [`sendAnalyticsEvent`](/reference/sdk/analytics/sendAnalyticsEvent) and provides a way to respond to those events.

## Import

```tsx
import type { AnalyticsEvent } from '@faststore/sdk'
import { useAnalyticsEvent } from '@faststore/sdk'
```

## Usage

The `useAnalyticsEvent` hook accepts a callback function that runs whenever the `sendAnalyticsEvent` is fired. The callback function you provide receives the event that triggered its execution as an argument. 

Ideally, you should use the `useAnalyticsEvent` hook to transmit events to the analytics provider of your choice (e.g., Google Analytics).

```tsx
import type { AnalyticsEvent } from '@faststore/sdk'
import { useAnalyticsEvent } from '@faststore/sdk'

export const AnalyticsHandler = () => {
  useAnalyticsEvent((event: AnalyticsEvent) => {
    /**
     * This is where you can send events to your analytics provider
     *
     * Example:
     * window.dataLayer.push({ event: event.name, ecommerce: event.params })
     */
  })

  /* ... */
}
```

## Events from external libraries

External libraries can also send events via the Analytics module. This means that you might come across unexpected events being intercepted by `useAnalyticsEvent`. This is usually not a problem since most common analytics providers don't break if you send them meaningless data. However, if you face this issue, filter the events by name to ensure that only the desired events are sent to the provider.