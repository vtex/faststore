---
title: The future of FastStore Analytics
description: 'We want to hear from you: what would you like to see from the FastStore team regarding analytics?'
tags: [faststore, analytics]
hide_table_of_contents: false
authors: icaro
---

In this article, we share our vision for the future of analytics on FastStore and invite you to share your thoughts.

Before we start, it's important to highlight that **this is not a commitment** to any of the following topics, and we have not yet planned when they will be implemented or even if they'll come to be. That being said, we envision an ever-evolving analytics solution for FastStore, and we count on you to build it together with us.

### Universal Analytics

We want to make it easy to migrate to FastStore, regardless of where you are coming from. To address that, **we intend to support Universal Analytics on our official starters**. We still plan to recommend and enforce Google Analytics 4 whenever possible. Still, we want to give our users and developers the time they need to fully understand and migrate to the new version of Google Analytics.

### `dataLayer` completeness

To create rich reports about ecommerce operations, collecting rich data is necessary. In Google Analytics and Google Tag Manager, this is done by pushing data to the `dataLayer`. 

Currently, our official starters support only GA4 Enhanced Ecommerce capabilities. This is not enough for most stores, which need more data powering their reports. We want to address this issue. 

There's no definitive answer for **which properties we should include in our official starters' `dataLayer` by default**, and that's why we want to hear from you. 

:::tip
Help us build the future of the Analytics SDK module by letting us know which are the most common properties and events you manually included in the `dataLayer`, why they're important and why they should be built into our starters.
:::

### Analytics libraries for store segments

Grocery, fashion, and appliances are all store segments with specific needs regarding design, functionality, and, of course, analytics.

We believe it makes sense to have **custom-built events targeted to specific store segments** so these stores can fully understand the shoppers' behavior. For grocery, for example, we believe it would be helpful to know how many users try to enter their address, but there's no store near them or the most popular stores in a given area. 

These libraries would be accompanied by extensive documentation explaining the meaning behind each event, when to fire them, which information is required, autocomplete, how to integrate it with Google Analytics, etc. Also, using these libraries would be optional.

### Zooming out

The Analytics SDK module, Partytown, and the built-in integration offered by our official starters make us really excited about our analytics solutions and what's to come. We have a great opportunity to offer our clients a delightful experience while still allowing them to explore options other than the ones we've established by default. The future can also look bright, and we want to hear from you: what would you like to see from the FastStore team regarding analytics?

---

## Continue learning

To continue learning, check our advanced guide about [Analytics on FastStore](conceptual-guides/analytics-on-faststore).