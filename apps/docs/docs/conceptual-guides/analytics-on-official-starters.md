---
title: Analytics on official starters
description: An overview of our analytics solutions implemented by our official starters and a brief comparison with Store Framework's approach to analytics.
tags: [ga, gtm, google analytics, google tag manager, google, analytics, sdk, faststore, starters, store framework, AnalyticsHandler, gtmContainerId]
hide_table_of_contents: false
---

# Analytics on official starters

:::info
We strongly recommend reading the [Analytics on FastStore](/conceptual-guides/analytics-on-faststore) article before diving into this article.
:::

The recommended way to start building with FastStore is with one of our official starters. They are functional store templates that adhere to web performance and accessibility best practices, also serving as a guideline for all developers building storefronts with FastStore. In this regard, all our official starters have built-in analytics capabilities. 

This article explains how these starters integrate with analytics features and other architectural aspects. 

## Google Tag Manager

Our official starters include built-in **Google Tag Manager (GTM)** scripts, so developers don't have to worry about manually implementing the GTM script to their website nor configuring debug query strings related to [Partytown](https://www.faststore.dev/how-to-guides/troubleshooting/analytics-and-partytown#google-tag-assistant-is-not-working). 

Our official starters come with two GTM scripts in the `src/components/ThirdPartyScripts/GoogleTagManager.tsx` component: one that runs inside Partytown if the `gtm_debug` query string is not present, and one that runs outside Partytown otherwise. 

Notice that this does not affect performance since the actual GTM script is only downloaded once.

## Configuration

The **GTM container** being used in your store must be set in the file `store.config.js` as the value of the `gtmContainerId` variable of the `analytics` object. If no GTM container is provided, the GTM script is not included on the page.

## Firing events

The [`sendAnalyticsEvent`](https://www.faststore.dev/reference/sdk/analytics/sendAnalyticsEvent) function is used to fire analytics events. All [**GA4 Enhanced Commerce events**](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) are bundled with official starters and are fired in different places in the code, depending on what actions should trigger them.

Notice that each store is responsible for firing the desired analytics events and configuring their corresponding properties. No hook or library can do this automatically, and you must set it manually in your code.

If the code responsible for sending these events is deleted, the events will stop being fired. Hence, it's important to be vigilant when moving or deleting code: you might be removing portions of code that are important to analytics. Also, always make sure that E2E tests for analytics are passing.

Official starters also include **VTEX Intelligent Search (IS)** events. These events are not sent to the `dataLayer` and are handled as described in the following sections. IS events are intentionally different from the ones fired for Google Analytics, so it's easier to add properties to events and to distinguish which properties are relevant to each analytics provider.

## `AnalyticsHandler` component

Even though the Analytics SDK module does not automatically send events to any analytics provider, our official starters do. That's the `AnalyticsHandler`'s (`src/analytics/index.tsx`) role. The `AnalyticsHandler` component calls the [`useAnalyticsHandler`](https://www.faststore.dev/reference/sdk/analytics/useAnalyticsEvent) hook to intercept analytics events. It's in the `AnalyticsHandler` component that events are sent to the appropriate analytics provider, such as GTM, IS, or VTEX Request Capture (RC).

To perform these actions, this component has to be included on every page, which means it usually lives alongside context providers at the root of the application (`gatsby.(browser-server).tsx` in Gatsby and `src/pages/_app.tsx` in NextJS).

## Dynamic imports

Some analytics providers do not require their scripts to be executed as soon as the page is rendered. This is a desired behavior because it means the code required to do it doesn't have to be downloaded and parsed as soon as a user enters the page, which is important for performance. That's why we use dynamic imports for all VTEX-specific events.

The code that sends and manages events related to IS and RC is only downloaded when an event is sent. That's done by dynamically and lazily importing their scripts. 

:::tip
Developers can and should use dynamic imports with any other analytics provider integrations added to their store.
:::

```tsx
import type { AnalyticsEvent } from '@faststore/sdk'
import { useAnalyticsEvent } from '@faststore/sdk'

import storeConfig from '../../../store.config'

export const AnalyticsHandler = () => {
  useAnalyticsEvent((event: AnalyticsEvent) => {
    /* ... */

    import(`./platform/${storeConfig.platform}`).then(
      ({ default: sendEvent }) => {
        sendEvent(event)
      }
    )
  })

  return null
}
```

## Page View events

Page View events represent the action of visiting a web page. These events can be automatically tracked by Google Analytics 4, but for limitations imposed by Partytown, collecting this metric does not work automatically. To compensate for that, these events should be fired manually. 

:::caution
Our official starters do not include the Page View event yet, but we plan to add it soon. Meanwhile, developers can still use the FastStore SDK to manage this event.
:::

## Partytown proxy

Partytown requires a proxy for some third-party scripts to work. (*Please refer to [Partytown documentation](https://partytown.builder.io/proxying-requests) for more information.*) This script isn't necessary for GTM and [`gtag`](https://support.google.com/tagmanager/answer/7582054?hl=en), so we haven't added it yet to our starter, but we'll include it in the future. Meanwhile, you can implement your own proxy and follow Partytown's guide on how to set it up.

## Help us

FastStore official starters come with GA4 Enhanced Ecommerce events by default, and while we always strive to adhere to Google guidelines, it's possible we committed some errors in this process. In this regard, developers can use the autonomy and visibility afforded by FastStore to fix these issues in their own projects. Still, we also want to improve our starters so that other developers can have the best experience using FastStore and our analytics tools.

Hence, speak up and help us build the future of FastStore Analytics! Let us know if you found any inconsistencies between GA4 Enhanced Ecommerce guidelines and our implementation or want us to add new analytics features to our starters.