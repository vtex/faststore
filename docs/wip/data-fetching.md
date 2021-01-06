## How to fetch data for your pages

Leveraging from [Gatsby](https://www.gatsbyjs.com/)'s hybrid nature of fetching static and dynamic data, the Store Framework Jamstack (SFJ) allows you to create both fast static and engaging dynamic content.

That means it's possible to fetch data in build time - for static contents, or through a runtime on the client-side - for dynamic contents.

In the following sections, you'll learn whether to use static or dynamic content depending on the nature of the data and its context.

> ℹ️ We strongly encourage you to check Gatsby's documentation on [querying for data with Gatsby](https://www.gatsbyjs.com/docs/how-to/querying-data/).

### Static data

Static data is the content that does not change frequently or per user interaction. We recommend using static rendering when the content doesn't change very often, and when you want to guarantee the fastest possible loading time.

Take the following example: imagine you have a product page, whose descriptions, attributes, and photos rarely change. In this case, you can benefit from retrieving fast static data during build time so that, when a customer accesses this product page, the data is almost instantly loaded.

>ℹ️ *Notice that, on the same page, you can have both static and dynamic data. For example, you can have dynamic data for your product price.*

Gatsby provides two ways to fetch static data:

- Using a [Page Query](https://www.gatsbyjs.com/docs/recipes/querying-data#querying-data-with-a-page-query) to query data from your SFJ store's pages.

- Using a [Static Query](https://www.gatsbyjs.com/docs/how-to/querying-data/static-query/#reach-skip-nav) to retrieve data via a GraphQL query.

### Dynamic data

Dynamic data is the content that constantly changes or which relies on user's interactions.

Take the following example: imagine you have a shipping calculator component, which regularly changes depending on the user's location. In this case, using static data is not an option.

Interactive components, such as shipping calculators or shopping carts, must obligatorily incorporate a backend communication capability so they can retrieve data when a customer interacts with your website.

For client runtime data fetching, you can apply any method you would use in a regular [React](https://reactjs.org/) app. For example, using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to retrieve data from a Rest API or an [Apollo client](https://www.apollographql.com/docs/react/) to retrieve data from a [GraphQL](https://graphql.org/) API.

## Fetching data in the SFJ

The [`@vtex/gatsby-source-vtex`](https://www.gatsbyjs.com/plugins/@vtex/gatsby-source-vtex/?=vtex) plugin, pre-setted in the [Store Components starter](https://github.com/vtex-sites/storecomponents.store), is used to fetch data from all VTEX public [REST API's](https://developers.vtex.com/vtex-developer-docs/reference/get-to-know-vtex-apis) that powers VTEX stores.

>ℹ️ The [`@vtex/gatsby-source-vtex`](https://www.gatsbyjs.com/plugins/@vtex/gatsby-source-vtex/?=vtex) plugin connects the [Gatsby data layer](https://www.gatsbyjs.com/docs/porting-from-create-react-app-to-gatsby/#unified-graphql-data-layer) to the VTEX [Store GraphQL interface](https://github.com/vtex-apps/store-graphql) allowing Gatsby to access VTEX API's through your SFJ application.

To be able to use this plugin, it's necessary to configure its settings. Take the following steps:

1. Open your SFJ project in any code editor of your choosing.
2. From the root directory, go to the `gatsby-config.js` file.
3. Head to `plugins` and, inside `@vtex/gatsby-source-vtex`, replace the `STORE_ID` value with the `name` of your VTEX account.
>ℹ️ *The [`gatsby-config.js`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) file defines your site’s metadata, plugins, and other general configurations.*
    ```js
    plugins: [
        {
          resolve: `@vtex/gatsby-source-vtex`,
          options: {
            tenant: STORE_ID, // VTEX account name
            environment: 'vtexcommercestable' , // it can be vtexcommercestable or vtexcommercebeta
            workspace: 'master', // https://vtex.io/docs/concepts/workspace/ 
          },
        },
    ```
4. Run the site with the `yarn develop` command. At the end of the running summary, you'll receive a successful message with the URL to the [Gatsby GraphQl playground](https://www.gatsbyjs.com/docs/using-graphql-playground/#reach-skip-nav).
    ```
    View GraphiQL, an in-browser IDE, to explore your site data and schema
    ⠀
    http://localhost:8000/___graphql
    ```
Now, if you access this URL in your browser, you'll be able to fetch and change data from the [Store GraphQL interface](https://github.com/vtex-apps/store-graphql). Feel free to test the queries and see what they return.

To use this data on your website, follow the referenced links in the [How to fetch data for your pages](#How-to-fetch-data-for-your-pages) section.
