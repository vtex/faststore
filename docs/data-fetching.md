# Fetching data

The [`@vtex/gatsby-source-vtex`](https://www.gatsbyjs.com/plugins/@vtex/gatsby-source-vtex/?=vtex) plugin, pre-setted in the [Store Components starter](https://github.com/vtex-sites/storecomponents.store), is used to fetch data from all VTEX public [REST API's](https://developers.vtex.com/vtex-developer-docs/reference/get-to-know-vtex-apis) that powers VTEX stores.

>ℹ️ The [`@vtex/gatsby-source-vtex`](https://www.gatsbyjs.com/plugins/@vtex/gatsby-source-vtex/?=vtex) plugin connects the [Gatsby data layer](https://www.gatsbyjs.com/docs/porting-from-create-react-app-to-gatsby/#unified-graphql-data-layer) to the VTEX [Store GraphQL interface](https://github.com/vtex-apps/store-graphql) allowing Gatsby to access VTEX API's through your SFJ application.

In the following section, you'll learn how to use and configure this plugin settings.

## Step by step

1. Open your SFJ project in any code editor of your choosing.
2. From the root directory, go to the `gatsby-config.js` file.
3. Head to the `plugins` section and, within `@vtex/gatsby-source-vtex`, replace the `STORE_ID` value with the `name` of your VTEX account.

>ℹ️ *The [`gatsby-config.js`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) file defines your site’s metadata, plugins, and other general configurations.*
    
```js
plugins: [
    {
        resolve: `@vtex/gatsby-source-vtex`,
        options: {
            tenant: STORE_ID, // VTEX account name
            environment: 'vtexcommercestable', // it can be vtexcommercestable or vtexcommercebeta
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

Now, if you access this URL in your browser, you'll be able to fetch and change data from the [Store GraphQL interface](https://github.com/vtex-apps/store-graphql). 

Feel free to test the queries and see what they return.

To use this data on your website, check Gatsby's documentation on [Data Fetching](https://www.gatsbyjs.com/docs/data-fetching/) and [Querying data.](https://www.gatsbyjs.com/docs/recipes/querying-data/)
