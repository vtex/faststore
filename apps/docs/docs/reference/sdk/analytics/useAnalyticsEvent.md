# useAnalyticsEvent

To intercept events that were fired using the analytics module, you should use the `useAnalyticsEvent` hook. It automatically detects which events were sent using the [sendAnalyticsEvent](/reference/sdk/analytics/sendAnalyticsEvent) function and provides a way to react to those events. The `useAnalyticsEvent` hook can be used to intercept both native and custom events.

## How to use
The `useAnalyticsEvent` hook accepts a callback function that runs whenever an event is fired.

The callback function you provide receives the event that triggered its execution as an argument. Ideally, this is the place you actually send the event to the analytics provider of you choice. 

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

## External libraries

External libraries can also send events using the analytics module. This means that you might come across unexpected events being intercepted by `useAnalyticsEvent`. This is usually not a problem, since most common analytics providers don't break if you send additional (irrelevant) data to them. If you're using one that does, make sure to filter the events by name, so only the expected events are sent to the provider.