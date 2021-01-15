# Data structure 

Leveraging from [Gatsby](https://www.gatsbyjs.com/)'s hybrid nature of fetching static and dynamic data, the Store Framework Jamstack (SFJ) allows you to create both fast static and engaging dynamic content.

That means it's possible to fetch data in build time - for static contents, or through a runtime on the client-side - for dynamic contents.

In the following sections, you'll learn whether to use static or dynamic content depending on the nature of the data and its context.

> ℹ️ We strongly encourage you to check Gatsby's documentation on [querying for data with Gatsby](https://www.gatsbyjs.com/docs/how-to/querying-data/).

## Static data

Static data is the content that does not change frequently or per user interaction. We recommend using static rendering when the content doesn't change very often, and when you want to guarantee the fastest possible loading time.

Take the following example: imagine you have a product page, whose descriptions, attributes, and photos rarely change. In this case, you can benefit from retrieving fast static data during build time so that, when a customer accesses this product page, the data is almost instantly loaded.

>ℹ️ *Notice that, on the same page, you can have both static and dynamic data. For example, you can have dynamic data for your product price.*

Gatsby provides two ways to fetch static data:

- Using a [Page Query](https://www.gatsbyjs.com/docs/recipes/querying-data#querying-data-with-a-page-query) to query data from your SFJ store's pages.

- Using a [Static Query](https://www.gatsbyjs.com/docs/how-to/querying-data/static-query/#reach-skip-nav) to retrieve data via a GraphQL query.

## Dynamic data

Dynamic data is the content that constantly changes or which relies on user's interactions.

Take the following example: imagine you have a shipping calculator component, which regularly changes depending on the user's location. In this case, using static data is not an option.

Interactive components, such as shipping calculators or shopping carts, must obligatorily incorporate a backend communication capability so they can retrieve data when a customer interacts with your website.

For client runtime data fetching, you can apply any method you would use in a regular [React](https://reactjs.org/) app. For example, using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to retrieve data from a Rest API or an [Apollo client](https://www.apollographql.com/docs/react/) to retrieve data from a [GraphQL](https://graphql.org/) API.
