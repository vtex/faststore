---
title: July, 2021
description: FastStore Release Notes
tags: [faststore]
hide_table_of_contents: false
---

Roll out the welcome mat, team, FastStore Release Notes it's here! 🎉

We are excited to bring the latest key changes on our platform from last June and make sure you're up-to-date with: 

- Features on point
- Bugs? Not on my watch!
- Improvements to take you to the next level
- Breaking changes 
- Documentation to guide you
- And a special thanks to our folks!

Our team has prepared thrilling releases which will brighten your day. Lay back, spread the word and let's check it!  🚀

<!--truncate-->


## Features 🚀
- We've added the **Thumbor plugin** so you can integrate `gatsby-plugin-image` with [thumbor](http://thumbor.org/), make your own smart image handling service and 

    Thumbor is an open-source image processing service that enables you to process any image on the web.Check out the [documentation](https://github.com/vtex/faststore/blob/master/packages/gatsby-plugin-thumbor/README.md) and get more details on how to use it.


- **Renovate preset configuration:** a preset configuration for Renovate app, so stores can use the same configuration source for their Renovate configuration. https://github.com/vtex/faststore/tree/master/packages/renovate-config


- **Price atom:** [#760](https://github.com/vtex/faststore/pull/760): Let's imagine, you want to render some prices, like the following:

    ![Screen Shot 2021-06-11 at 11 57 46](https://user-images.githubusercontent.com/8127610/121706732-48d47180-caac-11eb-8d56-80049b60f46f.png)

    With the Price atom, you can now show prices in your storefront. Take a look on the [Price package](https://github.com/vtex/faststore/tree/master/packages/store-ui/src/atoms/Price)


- **MDX story:** [#762](https://github.com/vtex/faststore/pull/762): We brought [MDX](https://storybook.js.org/docs/react/writing-docs/mdx), so you can get the best of both worlds: writing documentation with Markdown syntax and embed JSX component blocks on the same document. Check the following example to see how it works: 



    It's an accessible way to collaborate on suggestions or add more information to our components. Easy-peasy, yet powerful!


## Bug Fixes 🐛

- **CI/CD** [#680](https://github.com/vtex/faststore/pull/680): by changing CI/CD it solves two issues on master: building twice the same code and  running the CI workflow twice.

- **Source products using Inteligent Search** [#738](https://github.com/vtex/faststore/pull/738): previously, to speed up the search for products, it was possible to paginate the search and search the pages in parallel. However, the API  would return duplicate products between pages which caused an unreliable build, where consecutive builds would generate a different amount of pages. To fix this issue, we have Intelligent Search (IS). 

- **Handle chunkLoadError** [#771](https://github.com/vtex/faststore/pull/771): After an error, if the page got refreshed way too fast or if the file was not available on the server anymore, webpack would throw a ChunkLoadError, and then you would be redirected to the 500 page. This solves the problem by refreshing the page when a `chunkLoadError` happens on the React tree.

- **Replace on personalized search redirect** [#780](https://github.com/vtex/faststore/pull/780):
When redirect, use `replace` instead `push` to replace the URL to personalized search.

## Breaking Changes 💥

- **Storybook** [#776](https://github.com/vtex/faststore/pull/776): we're excited to announce the [Store UI](https://storeui.netlify.app/), a store component library for building your next digital experience.
Make sure to explore it and take a look in [here](https://github.com/vtex/faststore/tree/master/packages/store-ui) to follow the improvements and see how can you contribute.

## Improvements ✔️
- **`gatsby-plugin-nginx` configurability** [#747](https://github.com/vtex/faststore/pull/747): Now, `gatsby-plugin-nginx` configurability can add custom server block options, add custom http block options, and create redirects with more than one variable.

- **React version** [#753](https://github.com/vtex/faststore/pull/753): with this improvement we upgrade it to add support for React 18.

- **CONTRIBUTING.md** [#775](https://github.com/vtex/faststore/pull/775): We've added a bot to include the commands to release the application, so [CONTRIBUTING.md](https://github.com/vtex/faststore/blob/master/CONTRIBUTING.MD) doesn't need to do this service from now. 


## Documentation 📑
- Move faststore docs to a folder inside Store Framework [#685](https://github.com/vtex/faststore/pull/685) - [documentation](https://github.com/vtex/faststore/blob/master/docs/e2e-testing.md)
- Choosing Static Paths [#791](https://github.com/vtex/faststore/pull/791) - [documentation](https://github.com/vtex/faststore/blob/master/docs/static-paths.md)

## Praises ✨
- [@leomp12](https://github.com/leomp12)
- [@cameronbraid](https://github.com/cameronbraid)

Thank you all 💪