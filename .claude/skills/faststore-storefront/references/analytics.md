---
name: faststore-analytics
description: How to send and receive analytics events using @faststore/sdk, and how to configure Google Tag Manager in a FastStore storefront. Use when adding analytics tracking, firing custom events on user interactions, listening for events in a handler component, or setting up GTM.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore Analytics

FastStore provides an analytics module via `@faststore/sdk` for sending and receiving events.

## Imports

```typescript
import { sendAnalyticsEvent, useAnalyticsEvent } from "@faststore/sdk";
```

- `sendAnalyticsEvent` — Dispatches a custom event to all registered analytics handlers
- `useAnalyticsEvent` — Hook that listens for analytics events (used in handler components)

## Sending Events

Call `sendAnalyticsEvent` on user interactions:

```tsx
import { sendAnalyticsEvent } from "@faststore/sdk";

interface ArbitraryEvent {
  name: string;
  isEcommerceEvent?: boolean;
  params: Record<string, any>;
}

const onSubmit = async (event: FormEvent) => {
  event.preventDefault();

  sendAnalyticsEvent<ArbitraryEvent>({
    name: "Submit Newsletter",
    params: {
      form_location: "custom_newsletter_section",
      user_agent: navigator.userAgent,
    },
  });

  // After successful action
  sendAnalyticsEvent<ArbitraryEvent>({
    name: "Submit newsletter success",
    params: { campaign: "newsletter_signup", source: "organic" },
  });
};
```

## Receiving Events — Analytics Handler Component

Place an `AnalyticsHandler` component inside your section to capture and forward events to your analytics provider:

```tsx
import { useAnalyticsEvent } from "@faststore/sdk";

interface ArbitraryEvent {
  name: string;
  isEcommerceEvent?: boolean;
  params: Record<string, any>;
}

export const AnalyticsHandler = () => {
  useAnalyticsEvent((event: ArbitraryEvent) => {
    // Forward to your analytics provider (GTM, GA4, Segment, etc.)
    // In development, console.log is fine for debugging
    console.log("Received event", event);

    // Example: push to GTM dataLayer
    // window.dataLayer?.push({ event: event.name, ...event.params });
  });

  return null; // Renders nothing — only listens
};
```

## Full Example — Custom Newsletter with Analytics

```tsx
// src/components/sections/CustomNewsletter/CustomNewsletter.tsx
import { FormEvent } from "react";
import { sendAnalyticsEvent, useAnalyticsEvent } from "@faststore/sdk";

interface NewsletterEvent {
  name: string;
  params: { form_location: string; [key: string]: any };
}

const AnalyticsHandler = () => {
  useAnalyticsEvent((event: NewsletterEvent) => {
    console.log("Analytics event:", event);
  });
  return null;
};

function CustomNewsletter() {
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    sendAnalyticsEvent<NewsletterEvent>({
      name: "newsletter_subscribe",
      params: { form_location: "custom_newsletter_section" },
    });
  };

  return (
    <section>
      <AnalyticsHandler />
      <form onSubmit={onSubmit}>
        {/* form fields */}
      </form>
    </section>
  );
}

export default CustomNewsletter;
```

## Google Tag Manager

GTM is configured in `discovery.config.js`:

```js
analytics: {
  gtmContainerId: "GTM-XXXXXXX", // Replace with your actual GTM container ID
},
```

FastStore Core automatically injects the GTM script using this container ID. No manual script injection is needed for GTM itself.
