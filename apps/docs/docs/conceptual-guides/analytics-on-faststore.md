---
title: Analytics on FastStore
description: An overview of our analytics solutions for FastStore.
tags: [ga, gtm, google analytics, google tag manager, google, analytics, sdk, faststore]
hide_table_of_contents: false
---

# Analytics on FastStore

The FastStore team is committed to building a great analytics experience for customers and developers. We understand a good analytics implementation is key for decision-making, marketing and sales in an ecommerce, so we've built tools and resources to help stores fulfill their analytics requirements.

Stores usually need to add 3rd party scripts to their webpage to integrate with analytics solutions. These scripts require running javascript on the browser, which often makes web pages slow and consequently hurts SEO performance and conversion rates. 

Remember: FastStore is the fullstack toolkit for building high-performance stores. Delivering bad performance is not an option, so we've built our analytics tools with performance in mind. We've also made it easy for developers to add and manage analytics integrations while maintaining great scores, so FastStore users don't have to choose between performance and analytics. For that, we had to be mindful to make decisions that make this possible.

## Google Analytics native support

The market for analytics solutions has been increasingly more competitive over the past few years, but one player takes the lead: Google Analytics. According to [W3Tech](https://w3techs.com/technologies/history_overview/traffic_analysis/ms/y), Google Analytics leads with 85.9% (2022 numbers) of the market. We see this trend among our user base as well, so it made sense to build solutions that work well with Google Analytics.

Google Analytics has two major versions today: Universal Analytics (UA) and Google Analytics 4 (GA4). Support for UA is set to end by July 2023, while GA4 takes its place with a new UI for building reports, new ways of sending data and data analysis tools. Google Analytics offers a set of ecommerce-focused capabilities that help developers and management teams to organize their data and build their reports. These capabilities are encapsulated in what Google calls [Enhanced Ecommerce](https://developers.google.com/tag-manager/enhanced-ecommerce). 

For many, GA4 represents the future of Google Analytics. For us, it is the present (more on that later). That's why FastStore natively supports all GA4 Enhanced Ecommerce capabilities. If you are developing with FastStore and use one of [our official starters](https://www.faststore.dev/starters), your store already includes everything needed to work with Google Analytics 4 Enhanced Ecommerce.

## It starts with FastStore SDK

FastStore SDK is a simple, framework-agnostic implementation of Commerce APIs that is composed of modules, and the [analytics module](https://www.faststore.dev/reference/sdk/analytics) is one of them. The analytics module is where our commitment to analytics in FastStore starts. This module provides ways of sending and intercepting events that by default follow GA4 Enhanced Ecommerce guidelines, that can be [extended and customized](https://www.faststore.dev/reference/sdk/analytics/how-to-extend-types).

Interacting with the analytics module is very simple. You can use the [sendAnalyticsEvent](https://www.faststore.dev/reference/sdk/analytics/sendAnalyticsEvent) function to send events and the [useAnalyticsEvent](https://www.faststore.dev/reference/sdk/analytics/useAnalyticsEvent) hook to intercept them. It was built to give freedom to developers to [send and handle events of any kind](https://www.faststore.dev/reference/sdk/analytics/how-to-send-custom-events).

It's important to note that FastStore SDK's analytics module is not a VTEX IO app nor does it work similarly. It merely provides an interface for sending and receiving events more easily, in part thanks to autocomplete features provided by TypeScript and code editors. Events are not automatically sent to any analytics provider, so to visualize data on Google Analytics per se, the store has to manually push these events into the `dataLayer` (which we do in our official starters).

## Partytown and 3rd party scripts

3rd party scripts are the standard way of integrating an ecommerce with an analytics provider. The problem with these 3rd party scripts is that they are usually very heavy and compete for browser resources when processing and executing javascript as the user loads the page, and that's all bad for performance.

As stated before, delivering bad performance is not an option for FastStore, so that's where [Partytown](https://partytown.builder.io/) comes into play. Partytown goal is "to help speed up sites by dedicating the main thread to your code, and offloading third-party scripts to a web worker", so scripts that usually compete for browser resources that are used to render the page, per se, no longer do.

While we recommend using Partytown along with FastStore, we recognize it's not a silver bullet just yet. To start, it doesn't fix the whole problem: stores will still need to download the script bundles. This is not a major issue, but it still (lightly) affects performance when browsing a store using a low bandwidth connection.

Also, there may be compatibility issues with a few 3rd party scripts. Check out this [Partytown and analytics troubleshooting](https://www.faststore.dev/how-to-guides/troubleshooting/analytics-and-partytown) doc: it goes through the most common issues users may face when using Partytown inside a FastStore project.

Since Partytown is in the beta stage, some issues are expected to happen. Despite this, what we like most about Partytown is the flexibility it offers: you don't need to use it for every 3rd party script in our store. If you face compatibility issues that cannot be easily resolved, you can move that script (or part of it) outside Partytown, and continue using it for the other scripts that work just fine.

## Analytics on official starters

We're always perfecting our official starters to include everything you need to have your store 100% compatible with GA4 Enhanced Ecommerce and Partytown from day 1. When you start your store from one of our official starters, Google Tag Manager and Partytown are automatically included with your store, so you don't have to worry about adding them manually.

We also use FastStore SDK's analytics module to send and intercept events, concentrating all analytics-related code in a single folder for better understanding and use.

To understand more about some decisions we had to make and how it all works behind the scenes, read the [Analytics on official starters](/conceptual-guides/analytics-on-official-starters) companion blog post. 

## The future 

Before we start describing the vision for the future of analytics on FastStore, it's important to highlight that this is just it: a vision. We are not committing to any of the following topics, and we have no clue when they're going to happen or even if they'll come to be.

That being said, we envision an ever-evolving analytics solution for FastStore. The next topics describe a few things we think are worth considering for the future.

### Universal Analytics

We want to make it easy to migrate to FastStore, regardless of where you are coming from. To address that, we intend to support Universal Analytics on our official starters. We still plan to recommend and enforce Google Analytics 4 whenever possible, but we want to give our users and developers the time they need to fully understand and migrate to the new version of Google Analytics.

### `dataLayer` completeness

To have rich reports about ecommerce operations, you have to collect rich data. When using Google Analytics and Google Tag Manager, pushing data to the `dataLayer` is the way developers can feed reports with information.

Currently, our official starters support only GA4 Enhanced Ecommerce capabilities. This is not enough for most stores, which need more data powering their reports, and we want to address this issue.

There's no definitive answer for which properties we should include in our official starters' `dataLayer` by default, and that's why we want to hear from you. Let us know the most commonly used properties and events you had to include manually in the dataLayer, why they're important and why they should be built into our starters.

### Analytics libraries for store segments

Stores usually focus on selling a specific category of products, such as grocery items. That's what we call a store segment. Grocery, fashion, and appliances are all store segments that have specific needs when it comes to design, functionality, and, of course, analytics.

We think it makes sense to have custom-built events targeted to specific store segments so these stores can fully understand the user behavior. For grocery, per se, it would be super useful to know how many users try to enter their address but there's no store near them or the most popular stores in a given area. 

These libraries would be accompanied by extensive documentation explaining the meaning behind each event, when to fire them, which information to put it, autocomplete for its properties, how to integrate it with Google Analytics, etc. Also, the use of these kinds of libraries would be optional.

## Zooming out

FastStore SDK's analytics module, Partytown and the built-in integration offered by official starters make us really excited about our analytics solutions and what's to come. We have a great opportunity to offer a delightful experience to our users, and still not limit them to the choices we've made along the path. The future can also look bright, and we want to hear from you: what would you like to see from the FastStore team regarding analytics?