---
id: analytics
---

# Analytics module

The analytics module lets you manage events in a simple way. You send an event using this module, the event is wrapped and then sent to the window over standard `postMessage` calls, which share the event only with the website's origin. This module provides a React Hook so it's possible to intercept the fired events. can be received via event listeners.

It's important to note that events sent using the analytics module are not directly sent to any analytics provider such as Google Analytics. This has to be done manually by using the provided hook. 

The analytics module supports sending and receiving events of any shape, so you can implement your own types and override default ones.

# Google Analytics support

Google Analytics is by far the industry leading analytics solution that most ecommerce websites use, and the analytics module was built with it in mind. All helper functions and hooks use the [Google Analytics 4 (GA4) data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) by default, which means GA4 events will be suggested along with recommended properties and [IntelliSense](https://docs.microsoft.com/pt-br/visualstudio/ide/using-intellisense) support.

To send the events to Google Analytics, you should listen to when they're sent - by using the [useAnalyticsEvent](/reference/sdk/analytics/useAnalyticsEvent) hook - and add them to the `dataLayer` in case you're using Google Tag Manager (recommended) or call the `gtag` function directly if you're using gtag's script directly. The analytics module doesn't do this automatically, so it has to be executed on the store.
