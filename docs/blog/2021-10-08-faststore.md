---
title: October, 2021
description: FastStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---

## Features 

- 🚀 **Send and receive custom events via the Analytics module** [#937](https://github.com/vtex/faststore/pull/937)
    
    We've added the `UknownEvent` event type to [the Analytics module](https://github.com/vtex/faststore/tree/master/packages/store-sdk/docs/analytics)\ This is a minimal event sent via the `sendAnalyticsEvent` function, which can be overwritten by other event types, such as [pre-purchase interactions](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtag#pre-purchase_interactions). 

    - Check out the details on how to manage analytics events in [the Analytics module documentation](https://github.com/vtex/faststore/tree/master/packages/store-sdk/docs/analytics) and [the Google Analytics 4 (GA4) data model](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).

<!--truncate-->

- 🚀 **Source store plugin** [#944](https://github.com/vtex/faststore/pull/944)

    We've added the plugin `gatsby-source-store` to source products and collections into the Gatsby's GraphQL layer. This plugin replaces the `gatsby-source-vtex` plugin and works with the store-api GraphQL schema. 

    - Learn how to install and use the `gatsby-source-store` plugin [ here](https://github.com/vtex/faststore/tree/master/packages/gatsby-source-store).


- 🚀 **Modal Molecule** [#957](https://github.com/vtex/faststore/pull/957)

    Use the [Modal Molecule](https://storeui.netlify.app/?path=/docs/molecules-modal--modal) to create alert windows in your storefront.

    ![gif-modal](https://user-images.githubusercontent.com/67270558/136008113-42f3722d-f82d-4b3f-bbe7-eaee04cb927f.gif)


- 🚀 **GraphQL Code Generator** [#960](https://github.com/vtex/faststore/pull/960)

    We've added the [GraphQL Code Generator](https://www.graphql-code-generator.com/) CLI to automatically generate TypeScript typings for [`store-api`](https://github.com/vtex/faststore/tree/master/packages/store-api).

- 🚀 **Spinner atom** [#961](https://github.com/vtex/faststore/pull/961)

    Now, you can use the  [Spinner atom](https://storeui.netlify.app/?path=/story/getting-started-welcome--welcome) as a loading button component.

    ![spinner-atom](https://user-images.githubusercontent.com/67270558/136010637-02d1608f-2de6-48f2-8678-50d9275cc390.gif)

- 🚀 **Cart component  with state validation** [#963](https://github.com/vtex/faststore/pull/963)

We modified the Cart APIs to provide a cart with state validation. The browser now has its cart state, which is validated by the backend. The backend signalizes if the frontend should be modified or not. For example, if the browser's state is not valid, containing a product currently unavailable at your store, the backend will send the updated cart state to the frontend. 

- 🚀 **Storybook theme** [#979](https://github.com/vtex/faststore/pull/979)

    Besides adding a new logo and theme to the Store UI Storybook, we also synced the [FastStore CHANGELOG.md](https://github.com/vtex/faststore/blob/master/CHANGELOG.md) with the [Storybook Changelog](https://storeui.netlify.app/?path=/story/releases-changelog--page).



## Bug Fixes 

- 🐛 **Developing a store in an account without the CMS Pages module** [#969](https://github.com/vtex/faststore/pull/969) - You can now develop on a store that does not have the CMS Pages module yet.

- 🐛 **Synchronously reading `regionId` initial value** [#974](https://github.com/vtex/faststore/pull/974) - The `regionID`is no longer lazy loaded, avoiding it to return a `null` value.
