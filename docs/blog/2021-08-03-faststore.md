---
title: August, 2021
description: FastStore Release Notes
tags: [faststore]
hide_table_of_contents: false
---

Gather around, people! FastStore Release Notes are back for the 2nd edition.🎊

Before we check out what our first-class team has prepared this past month (I really do mean it), Let's take a moment to praise you. Yes, you! You who is bold enough to be part of this transformation with us. Thank you!  

Now, shall we started it?  🚀

<!--truncate-->


## Features 🚀
- **CHANGELOG.MD** [#790](https://github.com/vtex/faststore/pull/790): Keep the changelog up-to-date  does not need to be a roadblock in your routine. `CHANGELOG.md` is automatically generated from your commit message. For a better way to create an explicit commit history, the commit merge messages need to follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

    For example, if your change is about a **fix**, create a commit with the following message:
    ```sh
    fix: describe what you are fixing here
    ```
    The PR title will become the merge commit message and will be used to generate the changelog.
    ![ie-generated-changelog](https://user-images.githubusercontent.com/1753396/123467151-8f56bf80-d5c6-11eb-9bec-acb305b09ac4.png)


- **Product page incremental builds** [#793](https://github.com/vtex/faststore/pull/793): Sourcing data does not need to be painful and bring problems when using Gatsby's incremental builds. Using `gatsby-graphql-toolkit` for sourcing data and using the declarative Gatsby File System API for declaratively create product pages can solve those issues. 

    Also, If you want to refresh the products, run the following command to clear the cache with Gatsby's cache:

    ```sh
    yarn clean

    ```
    Do not hesitate to check out the [Gatsby GraphQL Source Toolkit](https://github.com/gatsbyjs/gatsby-graphql-toolkit#gatsby-graphql-source-toolkit) for more information.

- **Product view - `gatsby-theme-store`** [##803](https://github.com/vtex/faststore/pull/803): We are one step closer to make `gatsby-theme-store` in `gatsby-plugin-store` since now it removes product view from `gatsby-theme-store` and create basic build blocks to drop shadow on product pages.

    Also, to understand better about shadowing, see the [shadowing documentation](https://github.com/vtex/faststore/blob/master/docs/shadowing.md).
   


## Bug Fixes 🐛

- **Using origin vtex** [#797](https://github.com/vtex/faststore/pull/797): No data trust issues around here, folks! To source product changes with the right values, now we use `productOriginVtex` option in search query 

- **Page size - `gatsby-source-vtex`** [#799](hhttps://github.com/vtex/faststore/pull/799): Weep no more for 404 errors while fetching products: we fix it! Also `gatsby-source-vtex`adds an option to fetch fewer products for testing purposes. 

- **Zip code persistence throughout the checkout flow**[#802](https://github.com/vtex/faststore/pull/802): Setting the zip code on the order form requires creating a new address for the user. However, for this use case, the `isDIsposable` field should be set to `true`, otherwise the behaviour is not well defined.

- **Missing GraphQL error messages**[#804](https://github.com/vtex/faststore/pull/804): An error like the one below does not say much, right? 

![before-error](https://user-images.githubusercontent.com/5691711/124333423-88055800-db6a-11eb-9e5c-f6bfe43a1e8a.png)

That's why we fixed GraphQL error messages so now you can see something like the following:
![after-error](https://user-images.githubusercontent.com/5691711/124333427-8d62a280-db6a-11eb-94a1-b32c83567605.png)

- **Fix undefined host in canonical tags of product pages**[#814](https://github.com/vtex/faststore/pull/814): to solve the problem of product pages having invalid canonicals, we generate relative canonical tags with `/<pathname>` during SSR and hydrate it with `https://<host>/<pathname>` once the React hydration kicks in.

- **Fix proxy pass when toPath has port numbers on it**[#830](https://github.com/vtex/faststore/pull/830): To avoid broke new test, this nginx plugin is replacing port number and not only `:splat` or `:*` values.

```sh
-           "https://mylogs-proxy.endpoint.com:8088/logs$is_args$args",
+           "https://mylogs-proxy.endpoint.com$1/logs$is_args$args",

```

- **Prevent building twice**[#872](https://github.com/vtex/faststore/pull/872): this fix improves build time on the faststore monorepo.

## Breaking Changes 💥

- **Add next/prev links in search page's infinite scroll.** [#811](https://github.com/vtex/faststore/pull/811): Our **Search page's template** uses infinite scroll, which helps improve the UX. However can cause problems for machines. Now the template has a **load more** button element as shown in the picture below:

![load-more-button](https://user-images.githubusercontent.com/1753396/124824085-4a2c7900-df48-11eb-9ba2-cd504faac7e3.png)

To make search engines understand pagination and keep the page's relevance we replace the `load more` button by an anchor tag `<a/>` linking to the next page in the infinite scroll. Also, add another anchor tag pointing to previous pages. As a final result, you have something similar to the next example:

![final-result](https://user-images.githubusercontent.com/1753396/124824941-611f9b00-df49-11eb-83d7-8108ad251355.png)

## Improvements ✔️
**Improve atoms pattern consistency** [#819](https://github.com/vtex/faststore/pull/819): We are always improving [Store UI](https://storeui.netlify.app/) and this time, We have added `ComponentArgTypes` type to improve the typescript check when typing argtypes from components:
![argtypes](https://user-images.githubusercontent.com/15680320/125642773-27945317-6663-4f03-8566-3f04d10b604d.png)

Any other improvements in atoms pattern consistency? Yes, let's see the following:

- Input and TextArea atoms state to variant.
- Deprecated Checkbox export name to UICheckbox, also add new Checkbox atom.
- Molecules and Atoms argtypes, to improve typescript errors.
- Checkbox export Prop name to CheckboxProps.


**Improve cms graphql types generation** [#865](https://github.com/vtex/faststore/pull/865), in other words, it improves graphql type generation for the cms plugin. 
> This is an architectural only change, no feature on the website should be changed. For this, make sure all content on the website stays the same from master.

For example, we have the following contentType written in Json Schema:

```sh
{
  homePage: {
    blocks: {
      banner: {
        type: 'object',
        properties: {
          imageUrl: {
            type: "string",
          }
        }
      }
    },
    extraBlocks: {
      seo: {
        tags: {
          type: 'object'
          properties: {
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            }
          }
        }
      }
    }
  }
}


```
Which will generate the following type on the gatsby's graphql layer:

```sh
type Block = {
  name: string
  props: any
}

type CmsHomePage = {
  sections: Block[]
  seo: {
    tags: {
       title: string
       description: string
    }
  }
}


```
And then query this data on React components by writting the following graphql query:

```sh
query HomePageQuery {
  cmsHomePage {
    sections: {
      name
      props
    }
    seo {
      tags {
        title
        description
      }
    }
  }
}

```


## Documentation 📑
- [How to implement the Search Banner Feature](https://github.com/vtex/faststore/blob/master/docs/how-to-create-banner-search.md) [#812](https://github.com/vtex/faststore/pull/812) 
- Update - [CONTRIBUTING.md](https://github.com/vtex/faststore/blob/master/CONTRIBUTING.MD) [#816](https://github.com/vtex/faststore/pull/816) 


Now that you are up-to-date with the release notes, I hope you feel energized to keep up the good work! Make sure to `star` the repo, so you keep your eyes on our next Release Notes.
See you next month 👋