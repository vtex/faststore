---
title: March, 2022
description: FastStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---

# March, 2022

New `Dropdown` component, improvements on the performance of `useStorage` hook, a new local server and GraphQL tests, and the addition of VTEX Headless CMS API Reference.

<!--truncate-->

## FastStore UI

### Dropdown 
- 🎉 **New `Dropdown` molecule** - [#1178](https://github.com/vtex/faststore/pull/1178) Use the `Dropdown` component as an options menu or a dropdown select.
![dropdown-menu](https://user-images.githubusercontent.com/51174217/158895409-45d16396-1181-49ec-a029-17e0b3599f34.gif)


## FastStore SDK
### setSession function
    
- 🐛 **Fixed `setSession` function type** - [#1172](https://github.com/vtex/faststore/pull/1172) 
Now the `ContextValue` of the `setSession` function receives a `session: Partial<Session>` argument. With the fix, it's possible to pass partial information of a session. For example:

``` 
const { setSession } = useSession()
setSession({ postalCode: 'foo' })
```



- ✨ **Improve the performance of `useStorage` hook** - [#1186](https://github.com/vtex/faststore/pull/1186) 
The `setTimeout` function was created to prevent the creation of tasks that take longer than 50ms to process. The function improves the performance of the `useStorage` hook by wrapping two of its tasks: the async promise and the set state of an item.

- ✨ **Add `setFacets` function to the search context** - [#1189](https://github.com/vtex/faststore/pull/1189)
The `setFacets` function sets all selected facets without any processing, allowing full control of the selected facets.


 
## FastStore API
### VTEX Platform

- 🐛 **Added missing `totalCount` field to `pageInfo` in `allCollections` query** - [#1173](https://github.com/vtex/faststore/pull/1173) 
Now the resolver for the `allCollections` query returns the number of valid collections in the store when a user asks for `pageInfo.totalCount` field.
    
- 🎉 **New `Session` query** - [#1176](https://github.com/vtex/faststore/pull/1176) 
The `Session` query returns only the channel and country values. The addition of this query enables VTEX regionalization, which requires the `regionId` located within the channel.
    
- 🎉 **Add local server and GraphQL tests** - [#1179](https://github.com/vtex/faststore/pull/1179)
The `@faststore/api` package now comes with an [Express GraphQL Server](https://graphql.org/graphql-js/running-an-express-graphql-server/) setup allowing you to test the API without having to link the package to a store. 

- ✨ **`hideUnavaibleitems` parameter in the search API** - [#1180](https://github.com/vtex/faststore/pull/1180) 
The Search API now has a parameter called `hideUnavailableItems`. This parameter either hides (true) or displays (false) an out-of-stock product.

- 🐛 **Removed frontend computation to the backend** - [#1184](https://github.com/vtex/faststore/pull/1184)
Offers are now sorted according to the order of the `offers` array.

- ✨ **Returning null as profile** - [#1190](https://github.com/vtex/faststore/pull/1190)
Now the API returns `null` for the `person` query when executed by an anonymous user, avoiding a mismatch with the default user session values, preventing the session of the anonymous user from being reset, and lowering the Total Blocking Time (TBT) metric.



## Documentation
- 📑 Added [VTEX Headless CMS API Reference](https://faststore.dev/vtex-headless-cms-api) - [#1194](https://github.com/vtex/faststore/pull/1194) 
The `vtex.admin-releases@0.x` app was added to [Step 2 - Installing the Headless CMS app on your VTEX account](https://faststore.dev/tutorials/cms/1#step-2---installing-the-headless-cms-app-on-your-vtex-account). The app is one of the VTEX Headless CMS's required apps.


## Internal
- 🐛 **Fixed codebase typos** - [#1183](https://github.com/vtex/faststore/pull/1183)
