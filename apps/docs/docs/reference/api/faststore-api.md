---
description: Get to know the FastStore API, an interface between your ecommerce platform and your store's frontend.
pagination_prev: null
---

import GraphQLExplorer from '@site/src/components/GraphQLExplorer/GraphQLExplorer'

# FastStore API

**FastStore API** is an interface between your ecommerce platform and your store's frontend. It uses **[GraphQL](https://graphql.org/)**, a query language for APIs and a runtime for fulfilling queries, in order to expose structured data from everyday ecommerce tasks to frontend components.

With the FastStore API, you can:
- Retrieve product data.
- Add items to the cart.
- Apply promotions to products.
- Filter search results. 

Also, thanks to a type-safe **GraphQL** protocol, the FastStore API allows developers to fetch only the strongly typed data needed for building robust and responsive solutions. In practice, developers can source the FastStore API to the [**Next.js**](https://nextjs.org/) or [**Gatsby**](https://www.gatsbyjs.com/) data layers and consume it on frontend components to create stores that use the [**Jamstack**](https://jamstack.org/) architecture.

![FastStore API usage architecture](https://vtexhelp.vtexassets.com/assets/docs/src/faststoreAPI2___58c4a9c4d23539900ef8b1cce9769288.png)

:::tip
To learn more about GraphQL and its main concepts, visit the official [GraphQL website](https://graphql.org/).
:::

## Exploring the API

It is a good idea to explore the FastStore API and get to know the data structure you can query and mutate from your store's frontend. There are a few different ways to do that, as described below.

### Playground

You can use the GraphQL playground below to test and explore the FastStore API.

<GraphQLExplorer query="query {
          allProducts(first: 10) {
            edges {
              node {
                name
              }
            }
          }
        }"/>

### GraphiQL

GraphiQL is an IDE you can launch from your browser in order to run GraphQL queries and mutations. This option has the advantage of displaying the reference documentation for each type and field in the `Docs` tab.

To use GraphiQL in your FastStore project, follow these steps:
1. If you do not have the latest version installed, run `yarn` in your project to reinstall the `@faststore/api` dependency.
2. Run `yarn develop` to start a local server.
3. Access GraphiQL by going to this address:

```
http://localhost:8000/___graphql
```

## Key features

FastStore API is based on [**Schema.org**](https://schema.org/) and inspired by **clean architecture**. 

### Improved brand findability 

FastStore API extends and simplifies [**Schema.org**](https://schema.org/), a set of agreed definitions for implementing structured data developed by Google, Microsoft, Yahoo, and Yandex.

The Schema markup aids search engines in understanding and displaying your content in a relevant way. It may improve your brand's findability by leading your website to a higher ranking in search results and, as a result, to more clicks and interactions with your store's website. 

### Flexible backend for frontend architecture

The FastStore API types and resolvers use a clean architecture to tackle specific ecommerce needs. The types specified in this schema are platform agnostic and may be used to build a wide range of custom frontend solutions. For instance:

1. Develop an ecommerce website with Next.js or Gatsby.
2. Create an Apollo Server instance on Heroku.
3. Run the executable schema in a function on Next.js.
