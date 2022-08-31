---
title: Analytics on FastStore
description: An overview of our analytics solutions for FastStore.
tags: [ga, gtm, google analytics, google tag manager, google, analytics, sdk, faststore]
hide_table_of_contents: false
---

# Analytics on FastStore

Implementing an effective analytics strategy is essential to help marketing and sales teams understand the trends in shoppers' behavior and make data-driven decisions.

For this end, stores usually implement third-party scripts that run Javascript on the client side. This practice, however, often slows web pages and consequently hurts SEO performance and conversion rates. 

To avoid this kind of issue in FastStore projects, FastStore comes with the [Analytics SDK module](/reference/sdk/analytics), which allows developers to add and manage analytics integrations while maintaining high Lighthouse scores.

## Google Analytics native support

Over the past few years, the analytics industry has become increasingly competitive, yet one player still takes the lead: **Google Analytics**. According to [W3Tech](https://w3techs.com/technologies/history_overview/traffic_analysis/ms/y), Google Analytics leads with 85.9% (2022 numbers) of the market. That's why we prioritize solutions that integrate seamlessly with Google Analytics.

Besides that, Google Analytics offers a set of ecommerce-focused capabilities that help developers and management teams organize their data and build their reports. These capabilities are encapsulated in what Google calls [Enhanced Ecommerce](https://developers.google.com/tag-manager/enhanced-ecommerce) and natively supported by FastStore.

Google Analytics has two main versions today: **Universal Analytics (UA)** and **Google Analytics 4 (GA4)**. While support for UA is planned to end by July 2023, the popularity of GA4 is increasing due to its new capabilities for creating custom reports, and transmitting and analyzing data. 

:::tip
If you are developing your FastStore project with one of [our official starters](/starters), your store already includes everything needed to work with **Google Analytics 4 Enhanced Ecommerce**.
:::

## FastStore SDK - Analytics

The FastStore SDK is a set of helpers, one of which is the [Analytics](/reference/sdk/analytics) module, that helps developers with daily activities and integration with other services. The Analytics module adheres to the **GA4 Enhanced Ecommerce** guidelines by default and provides [extensible and customizable](/reference/sdk/analytics/how-to-extend-types) methods for sending and intercepting events.

The module comes with the [`sendAnalyticsEvent`](/reference/sdk/analytics/sendAnalyticsEvent) function for sending events and the [`useAnalyticsEvent`](/reference/sdk/analytics/useAnalyticsEvent) hook for intercepting them. It also allows [sending and handling events of any kind](/reference/sdk/analytics/how-to-send-custom-events). Notice that events are not automatically sent to any analytics provider. Hence, to visualize data on Google Analytics, the store has to manually push these events into the [`dataLayer`](https://support.google.com/tagmanager/answer/6164391?hl=en#:~:text=A%20data%20layer%20is%20a,developer%20documentation%20for%20more%20information.) (which we do in our official starters).

## Third-party scripts and Partytown

Third-party scripts are the standard way of integrating an ecommerce with an analytics provider. The problem with these third-party scripts is that they usually harm performance by competing for browser resources while processing and executing Javascript during page load.

To avoid this issue, we recommend [Partytown](https://partytown.builder.io/), a lazy-loaded library that relocates resource-intensive scripts into a web worker and off of the main thread. In other words, scripts that usually compete for browser resources during page load no longer do.

We recognize, however, that Partytown doesn't fix the whole problem: stores will still need to download script bundles. This is not a central issue, but it still slightly affects performance in low bandwidth connections. 

Besides, since Partytown is in the Beta stage, there may be compatibility issues with some third-party scripts. Despite this, Partytown offers great flexibility: you don't need to use it for every third-party script in your store. If you face compatibility issues that cannot be easily resolved, you can move that specific script (or part of it) outside Partytown and keep using it for other scripts. For more information, please refer to the [Partytown and analytics troubleshooting](/how-to-guides/troubleshooting/analytics-and-partytown) guide. 

## Analytics on official starters

Our official starters are continuously updated to include everything needed to have a store 100% compatible with GA4 Enhanced Ecommerce and Partytown. When you start your FastStore project from one of our official starters, Google Tag Manager and Partytown are automatically implemented.

We also use the Analytics SDK module to send and intercept events, concentrating all analytics-related code in a single folder for better understanding and use.

To understand our team's architectural decisions, please refer to the [Analytics on official starters](/conceptual-guides/analytics-on-official-starters) article.