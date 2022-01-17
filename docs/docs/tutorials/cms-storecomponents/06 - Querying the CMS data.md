---
id: 6
sidebar_position: 8
sidebar_label: "6. Querying the CMS data"
pagination_next: tutorials/cms-storecomponents/7
---

# Part 6: Querying the CMS data

:::caution
This tutorial is intended for those who started their FastStore project with the Store Components starter. If you started your project with the Base Store starter, please refer to [this](/tutorials/cms-overview) tutorial.
:::

## Introduction

After setting up the CMS sections and content types interface, a corresponding type on the GraphQL data layer will be available for each content type that we have defined.

In this section, we'll see how to query for this data using the GraphiQL IDE and how to update our `pages` components to query for the CMS data.

---

## Querying the CMS data in GraphiQL

Before we query the CMS data in our `pages` components, let's verify how our data is structured using the GraphiQL IDE.

1. Open the terminal and change to the working directory of your project.
2. Start a development server.
   ```
   yarn develop
   ```
3. Open the GraphiQL IDE at [http://localhost:8000/__graphql](http://localhost:8000/__graphql). Notice that a corresponding type on the GraphQL data layer is available for each content type that you have defined (e.g., `cmsHome`, `cmsPlp`, `cmsSeo`).
4. Test some queries and check what they return. For example, for the `home` content type, try the following query:
   
   ```gql
  query MyQuery {
    cmsHome {
      sections {
        name
        props
      }
    }
  }   
  ```

  This will return a JSON object as in the following example:

  ```json
  {
    "name": "DynamicShelf",
    "props": {
      "searchParams": {
        "hideUnavailableItems": true,
        "from": 0,
        "to": 11,
        "collection": "143",
        "orderBy": "OrderByScoreDESC"
      },
      "title": "Special Offers"
    }
  },
  ```

In the following, we'll see how we will query this structured data inside our React components.

:::caution
If you change the `src/@vtex/gatsby-plugin-cms/index.ts` file, you must stop the current server, clean the cache (`yarn clean`) and then restart the server (`yarn develop`). Otherwise, your changes won't reflect in the GraphQL schema.
:::

## Querying the CMS data in the `pages` components

Let's now query the CMS data in our `pages` so we can update our React components with the CMS content.

1. Open your project in the code editor of your preference.
2. Open the corresponding page of your content type. For example, for the home page, open `/src/pages/index.tsx`.
3. Update the GraphQL query of your content type to fetch the desired data from the CMS. Take the following example.

  ```graphql {9-28} title=src/pages/index.tsx
  export const query = graphql`
    query HomePageQuery(
      $from: Int!
      $to: Int!
      $collection: String!
      $orderBy: String!
      $hideUnavailableItems: Boolean!
    ) {
      cmsSeo {
        seo {
          facebook {
            description
            thumbnail
            title
          }
          siteMetadata {
            description
            title
            titleTemplate
          }
        }
      }
      cmsHome {
        sections {
          name
          props
        }
      }
      ...
  `
  ```

  ---

## Related resources

- [Gatsby documentation - Querying data in pages with GraphQL](https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/)