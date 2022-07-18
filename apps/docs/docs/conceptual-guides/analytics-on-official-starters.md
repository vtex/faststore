---
title: Analytics on official starters
description: An overview of our analytics solutions implemented by our official starters and a brief comparison with Store Framework's approach to analytics.
tags: [ga, gtm, google analytics, google tag manager, google, analytics, sdk, faststore, starters, store framework, AnalyticsHandler, gtmContainerId]
hide_table_of_contents: false
---

# Analytics on official starters

:::info
Before reading this article, please read the companion post [Analytics on FastStore](/conceptual-guides/analytics-on-faststore).
:::

Our official starters are the recommended way to start building with FastStore. These starters are essentially functional stores that are built following performance and accessibility best practices. They serve as our guideline on how you should build your stores and how to leverage the most of the FastStore toolkit.

All of our official starters have analytics capabilities built-in. We follow the guidelines of the tools we've chosen so we can offer the best experience to developers and achieve completeness of ecommerce tracking capabilities. This article explains how we did it, some of the techniques we used and the main differences from the Store Framework approach to analytics in general. 


## Official Starters: how we did it

### Google Tag Manager

Our official starters include Google Tag Manager (GTM) scripts built-in. This means that developers don't have to worry about adding the GTM script to their page nor configuring debug query strings due to [Partytown limitations](https://www.faststore.dev/how-to-guides/troubleshooting/analytics-and-partytown#google-tag-assistant-is-not-working). Due to this, you'll be able to see two scripts in the `src/components/ThirdPartyScripts/GoogleTagManager.tsx` component: one that runs inside Partytown if the `gtm_debug` query string is not present, and one that runs outside Partytown otherwise. This does not affect performance, since the actual GTM script is only downloaded once.

### Store config

You can configure which GTM container you want to use in your store by accessing the file `store.config.js`. There, search for the `gtmContainerId` variable inside the `analytics` object. If no GTM container is provided, the GTM script is not included on the page.

### Firing events

In FastStore, you can fire analytics events using the [sendAnalyticsEvent](https://www.faststore.dev/reference/sdk/analytics/sendAnalyticsEvent) function. All [GA4 Enhanced Commerce events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) are bundled with official starters. They are fired in different places, depending on what should trigger them.

Official starters also include VTEX Intelligent Search (IS) events. These events are not sent to the dataLayer and are handled differently (more on this in the next sections). They're intentionally different from the ones fired for Google Analytics, so it's easy to add properties to events and to distinguish which properties are relevant to each analytics provider.

It's every store's responsibility to fire analytics events and to add the appropriate properties to them. No automatic hook or library is doing this magically. If the code that sends these events is deleted, the events will resume being fired. You should always keep an eye when moving or deleting code: you might be removing portions of code that are important to analytics. Always make sure that E2E tests for analytics continue passing.

### `AnalyticsHandler` component

When talking about FastStore SDK's analytics module, we usually say it does not automatically send events to any analytics provider, although our official starters do. That's `AnalyticsHandler`'s role. The `AnalyticsHandler` (`src/analytics/index.tsx`) component calls the [useAnalyticsHandler](https://www.faststore.dev/reference/sdk/analytics/useAnalyticsEvent) hook to intercept analytics events. It's in the AnalyticsHandler component events are sent to the appropriate analytics provider, such as GTM, IS or VTEX Request Capture (RC).

To do all that, this component has to be included in every page, which means it usually lives alongside context providers at the root of the application (`gatsby.(browser-server).tsx` in Gatsby and `src/pages/_app.tsx` in NextJS).

### Dynamic imports

Some analytics providers do not require their scripts to be executed as soon as the page is rendered. This is great because it means the code required to do it doesn't have to be downloaded and parsed as soon as a user enters the page, which is important for performance. That's why we use dynamic imports for all VTEX-specific events.

The code that sends and manages events related to Intelligent Search and Request Capture is only downloaded when an event is sent. We do that by dynamically and lazily importing their scripts. Developers can and should do that with any other analytics provider integrations they add to their store. 

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

### Page View events

Page View events represent the action of visiting a web page. These events can be automatically tracked by Google Analytics 4, but for limitations imposed by Partytown, collecting this metric automatically does not work. To compensate for that, your store should fire these events manually. Unfortunately, official starters do not include this event yet, but we plan to add it soon. Meanwhile, developers can still use the FastStore SDK to manage this event.

### Partytown proxy

Partytown requires a proxy for some 3rd party scripts to work. You can see a more detailed explanation [here](https://partytown.builder.io/proxying-requests). This script isn't necessary for GTM and gtag (Google's script used by GA and other solutions), so we haven't added it yet to our starter, but we'll include it in the future. Meanwhile, you can implement your own proxy and follow Partytown's guide on how to set it up.

## Store Framework contrast  

[VTEX Store Framework](https://vtex.com/br-pt/store-framework/) deals with analytics in its own way. It provides a Google Tag Manager app that is responsible for including the GTM script, including event properties, and adding the events to the dataLayer. In FastStore, there's no equivalent piece. All of that is done in the store itself. Both paradigms bring positive and negative implications. In this section, we'll go through important topics that highlight the contrast between the FastStore approach and the Store Framework approach when handling analytics.

### Freedom

The FastStore way of approaching analytics gives developers freedom. They are not tied in any way to any of the choices we've made for starters or FastStore SDK. You can fire your own events, customize them with your own types, and add your properties of choice. This empowers developers and store managers to collect data in the way they prefer, to achieve their unique objectives. We have guides on [How to extend and customize types](https://www.faststore.dev/reference/sdk/analytics/how-to-extend-types) and [How to send custom events](https://www.faststore.dev/reference/sdk/analytics/how-to-send-custom-events).

This is quite different from the Store Framework approach. If you need to deviate even a little from the Google Tag Manager app choices, events and properties, you'll need to detach from the whole app, creating your own implementation. Still, you'll be limited by the DOM events fired by native apps and blocks and the information they contain. If you want to change that, you'll have to detach from the native apps, which defeats the purpose of using Store Framework.

While Store Framework offers a more all-or-nothing approach to analytics that is easier to handle and maintain, FastStore focus on the freedom and power analytics solutions usually require to fulfill the needs of every store, offering more nuanced tools. FastStore also makes using [GA custom dimensions](https://support.google.com/analytics/answer/2709828) very easy, which is great for building custom reports and adding custom data to reports.

### Responsibility

With great power comes great responsibility. While FastStore gives the freedom developers need to build the analytics solutions they need, it deposits the responsibility of doing so on these developers. The events won't fire if you simply install FastStore SDK, nor will they be complete for every case. You have to fire the event you want at the right moment with the information you need, and that's up to you. Of course, official starters include GA4 Enhanced Ecommerce events, but that can also be deleted if developers are negligent. Maintainers have to actively care about their analytics implementation.

Store Framework gives analytics events for free. You barely have to worry about it if you use the native GTM app and native blocks to compose your pages. This is great, but it comes with the limitations we've talked about in the previous section. The main takeaway here is that with FastStore, you'll have to worry about if your analytics implementation is correct, and we think that's a good thing.

### Visibility

With Store Framework, it's very hard to know where or when an event is fired. This makes it difficult to debug problems and customize events. In FastStore, everything lives in your store repository. Just search for [sendAnalyticsEvent](https://www.faststore.dev/reference/sdk/analytics/sendAnalyticsEvent) calls and you'll see where events are being fired and the conditions for that to happen.

Also, FastStore provides E2E tests for all GA4 Enhanced Ecommerce analytics events it includes, so you can quickly know if something wrong with your analytics implementation. You'll be able to fix these issues before you start to lose valuable user data.

## Help us

As we've mentioned before, we include GA4 Enhanced Ecommerce events with FastStore starters. We're always trying to follow Google guidelines on how to implement these events, but it's possible we made some mistakes while doing so. We want developers to use the freedom, responsibility and visibility they have to fix these issues in the stores they are working on, but we also want to improve our starters so that other developers can have the best experience using FastStore and our analytics tools.

Help us! If you've found any inconsistency between GA4 Enhanced Ecommerce guidelines and our implementation or you just wish we added something to our starters to help you build your analytics solutions, please let us know.
