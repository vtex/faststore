---
title: FastStore - April, 2022
description: FastStore Release Notes
tags: [faststore]
hide_table_of_contents: false
---

The FastStore API no longer includes unused Gatsby plugins and now handles `channel` as a facet for search and product queries. Also, check out the new Troubleshooting guides and the Starter submission form.

<!--truncate-->

## FastStore UI

### Banner

- 🐛 **`otherProps` parameter** - [#1218](https://github.com/vtex/faststore/pull/1218)
  Other props can now be passed on the Banner component.

### DropdownMenu

- 🐛 **Fix `DropdownMenu` position** - [#1199](https://github.com/vtex/faststore/pull/1199)
  The `DropdownMenu` component no longer has issues with scrolling. Now the component has the properties `scrollLeft` and `scrollTop` to calculate the position, and adds `event.preventDefault()` in `KeyDown` press event, avoiding page scroll when pressed.

## FastStore SDK

### Analytics

- 🐛 **Fixed URL to events** - [#1228](https://github.com/vtex/faststore/pull/1228)
  The Analytics SDK types is now compliant with Google Analytics 4 (GA4), which means custom properties can't be added to events directly on the SDK.

## lighthouse-config

### Performance budget

- 🧹 **Increased the performance budget back to 95** - [1201](https://github.com/vtex/faststore/pull/1201)

## FastStore API

### VTEX Platform

#### Breaking change

- 💥 **Removed Gatsby plugins** - [1215](https://github.com/vtex/faststore/pull/1215)
  All unused Gatsby plugins were removed to be more open to other frameworks. The removal of unused Gatsby plugins also improved the speed with which the FastStore monorepo was published and developed.

| Before                                                                                                         | After                                                                                                        |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ![CI before](https://vtexhelp.vtexassets.com/assets/docs/src/ci-before___bcedaedec930f2dbceed123d3772bf7b.png) | ![CI after](https://vtexhelp.vtexassets.com/assets/docs/src/ci-after___5acdc31491853359ba96d17234e112e6.png) |

- 💥 **Handle `channel` as facet for search and product queries** - [1197](https://github.com/vtex/faststore/pull/1197)
  The `channel` function is now a string object that contains `salesChannel` and `regionId`. Before, `channel` were a integer that represented a sales channel now it has the following format in `store.config.js`:

```
// Default channel
  channel: '{"salesChannel":"1"}',
```

#### Enhancement

- ✨ **New Search event API** - [#1241](https://github.com/vtex/faststore/pull/1241)
  The `search.query` event has been added to the VTEX Intelligent Search Analytics API. This event is used to generate indices like `Top Searches` and `Suggestions`.

- ✨ **New Intelligent Search API** - [#1216](https://github.com/vtex/faststore/pull/1216)
  The simulation of search queries has been removed in favor of the new Intelligent Search API, which already performs the simulation.

#### Bug fix

- 🐛 **`@faststore/api` and VTEX catalog slug mismatches** - [#1214](https://github.com/vtex/faststore/pull/1214)
  The links between `@faststore/api` and VTEX Catalog are now fixed.

#### Chore

- 🧹 **Stable tests for the `faststore/api`** - [1200](https://github.com/vtex/faststore/pull/1200)
  The tests from `@faststore/api` are no longer reliant on dynamic data, which means they won't fail if something changes in the account from which the data is collected.

## Documentation

- 📑 **[Troubleshooting](https://www.faststore.dev/tutorials/cms/Troubleshooting) for Creating storefronts with Gatsby** - [#1261](https://github.com/vtex/faststore/pull/1261)
  Check out the new tutorial for common errors that you might face while working with FastStore.

- 📑 **New [Other Resources](https://faststore.dev/resources)** - [#1251](https://github.com/vtex/faststore/pull/1251)

- 📑 **New: send your feedback about faststore.dev** - [#1247](https://github.com/vtex/faststore/pull/1247)

- 📑 **New Starter: Next.JS** - [#1240](https://github.com/vtex/faststore/pull/1240)

- 📑 **New: [Starter submission](https://www.faststore.dev/starters/submissions)** - [#1239](https://github.com/vtex/faststore/pull/1239)
  Submit your starter and get featured on the FastStore Community Starters Library.

- 📑 **New [Release Notes - Lighthouse reports](https://faststore.dev/releases/2022/04/22/webops)** - [#1235](https://github.com/vtex/faststore/pull/1235)

- 📑 **New dark mode available in faststore.dev** - [#1233](https://github.com/vtex/faststore/pull/1233)

- 📑 **Updated [Extending the schema](https://faststore.dev/reference/api/faststore-api#extending-the-schema) in FastStore API documentation** - [#1224](https://github.com/vtex/faststore/pull/1224)

- 📑 **New [Troubleshooting problems in FastStore](https://faststore.dev/how-to-guides/local-development/troubleshooting-problems-in-faststore)** - [#1219](https://github.com/vtex/faststore/pull/1219)
  Check out the new guide on identifying if the issue you are facing is from FasStore/WebOps or a mistake on your side.

- 📑 **New [Sending CMS updates to VTEX IO WebOps](https://faststore.dev/how-to-guides/cms/vtex-headless-cms/Sending%20CMS%20updates%20to%20VTEX%20IO%20WebOps)** - [#1213](https://github.com/vtex/faststore/pull/1213)
  Check out the new user guide to learn how to set up WebOps to communicate with the VTEX Headless CMS and receive CMS updates via the VTEX Admin.

- 📑 **Updated [Configuring your VTEX account](https://faststore.dev/tutorials/cms/1#step-2---installing-the-headless-cms-app-on-your-vtex-account)** - [#1212](https://github.com/vtex/faststore/pull/1212)  
  The `vtex.admin-cms@0.x` and `vtex.admin-cms-graphql-rc@0.x` were updated to `@1.x`. Also, updated the build URL to `/build-releases` since Releases is now the default option to build and publish on the CMS.
- 📑 **New [Enabling private CMS previews](https://faststore.dev/how-to-guides/cms/vtex-headless-cms/Enabling%20private%20CMS%20previews)** - [#1211](https://github.com/vtex/faststore/pull/1211)
  Check out the new VTEX Headless CMS user guide on how to change public previews to private previews.

- 📑 **New [Gatsby 4 now available](https://faststore.dev/releases/2022/04/05/faststore) Release Note** - [#1210](https://github.com/vtex/faststore/pull/1210)
  FastStore infrastructure now allows the use of site generators that support server-side rendering (SSR), such as Next.js and Gatsby 4.

## Internal

- 📑 **Updated `faststore.dev` homepage** - [#1250](https://github.com/vtex/faststore/pull/1250)
- 📑 **Updated FAQ page in `faststore.dev`** - [#1249](https://github.com/vtex/faststore/pull/1249)

- 📑 **Updated `announcementBar` in `faststore.dev`** - [#1237](https://github.com/vtex/faststore/pull/1237)

- 📑 **Updated faststore.dev description for SEO** - [#1230](https://github.com/vtex/faststore/pull/1230)

- 📑 **Added faststore.dev thumbnail** - [#1229](https://github.com/vtex/faststore/pull/1229)

- 📑 **Updated `docusaurus.config.js` with GA4 `trackingID`** - [#1226](https://github.com/vtex/faststore/pull/1226)

- 📑 **Implemented Google Analytics 4 (GA4) in `faststore.dev`** - [#1222](https://github.com/vtex/faststore/pull/1222)
- 📑 **Updated [Gatsby overview](https://faststore.dev/tutorials/gatsby-overview)** - [#1205](https://github.com/vtex/faststore/pull/1205)
