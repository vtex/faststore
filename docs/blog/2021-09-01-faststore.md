---
title: September, 2021
description: FastStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---

Can you believe we are on the third edition of Release Notes? 😮 🎂
That happened in the blink of an eye!

While August looked like the longest month of the year, the icing on the cake is
our team news for these Release Notes, take a look at our edition's highlights:

<!--truncate-->


- 🚀 **Badge component** - create badges on top of your products.

- 💥 **Deprecated folders removed** - Who doesn't like a tidy house?

Get your birthday hat, and shall we check this edition?

## Features 🚀

- **Select Atom** [#876](https://github.com/vtex/faststore/pull/876): We have added to [Store UI](https://storeui.netlify.app)
the **Select** atom, which generates a select component, as you can see below.
![select-atom](https://user-images.githubusercontent.com/67270558/131666437-f7566813-37a5-47dc-bb12-c2f6a248cf36.gif)

  To check other options and see the code, go to [Select Atom on Store UI](https://storeui.netlify.app/?path=/docs/atoms-select--default-select).


- **Badge component** [#894](https://github.com/vtex/faststore/pull/894): a badge component is a great alternative when you want to create a **discount badge (or any highlighted property)** and add them on top of
your product. 

  For example, a discount badge on top of some ProductSummary components:

  ![discount-badge-example](https://user-images.githubusercontent.com/27777263/130467722-7c4cfa38-850b-41e4-ac6c-565e9edc552e.png)

  Explore more of this component in [Store UI](https://storeui.netlify.app/?path=/docs/atoms-badge--badge) and the [FastStore repo](https://github.com/vtex/faststore/tree/master/packages/store-ui/src/atoms/Badge).

- **Icon Button** [#900](https://github.com/vtex/faststore/pull/900): one more feature for your store is the Icon Button, which adds a **Shopping cart icon** to it. 

  Take a look at the [Store UI IconButton](https://storeui.netlify.app/?path=/docs/molecules-iconbutton--default) and also the [repo](https://github.com/vtex/faststore/tree/master/packages/store-ui/src/molecules/IconButton).

- **Agnostic store sdk analytics** [#903](https://github.com/vtex/faststore/pull/903): Anyone, including non-VTEX developers, can now use [`store-sdk`](https://github.com/vtex/faststore/tree/master/packages/store-sdk) to implement their analytics layer with the guarantee that it'll be fully integrated with [Google Analytics 4](https://developers.google.com/gtagjs/reference/ga4-events).

## Bug Fixes 🐛

- **Warnings and incremental builds - `gatsby-plugin-graphql`** [#889](https://github.com/vtex/faststore/pull/889): While using `gatsby-plugin-graphql`, you could get warnings to prevent adding two different queries with the same name.

  With this fix it tracks the filename of the query and only warns when two queries of the same name in different files are created.

- **Spread routes support - `gatsby-plugin-nginx`** [#895](hhttps://github.com/vtex/faststore/pull/895): Before any page created was available at, and only at `/:slug/`. If the user entered in `/:slug` it will receive a 404.
Now, we make the route `/{StoreCollection.slug}/`, for example, also respond at `/:slug`. Check more details in the [Spread routes support PR](https://github.com/vtex/faststore/pull/895).

- **Preventing stores from building - `gatsby-plugin-cms`**[#921](https://github.com/vtex/faststore/pull/921): Stores no longer break the build when remote nodes are null. 



## Breaking Changes 💥

- **Deprecated folders** [#927](https://github.com/vtex/faststore/pull/927): We are keeping "our house" tidy, and that's why we are removing all deprecated folders. From now on, the old state will be on the branch `legacy`.

  Also, it reduces the store-ui size to 10kb maximum.



## Improvements ✔️
- **Upgrade Gatsby** [#887](https://github.com/vtex/faststore/pull/887): Upgrading gatsby on each store could lead to some errors on `theme-store` and `plugin-performance`. Now, the packages are fixed while upgrading gatsby.

- **Remove `gatsby-config.js` from `theme-store`** [#888](https://github.com/vtex/faststore/pull/888):
To use different styling systems on different stores, we have removed `gatsby-config` from theme-store, virtually making it a plugin. 

- **Upgrade Storybook version** [#905](https://github.com/vtex/faststore/pull/905): Upgrades are always welcoming, mainly when we are talking about bugs! To fix bugs in some storybook versions we have ipgrade the package version.


That's all, folks, for our Release Notes. It should be a cakewalk to keep up the good work! 

Make sure to `star` the repo so you keep your eyes on our next Release Notes.
See you next month 👋🚀