# @faststore/graphql-utils

GraphQL utilities to use GraphQL over HTTP with ZERO bundle sizes

# Compatibility

This module solves the transport layer of GraphQL queries. For this reason, we only require a babel-friendly environment. Also, many graphql clients are supported. Example of such environments/clients are:

- [Gatsby](https://www.gatsbyjs.com/)
- [Next.JS](https://nextjs.org/)
- [Apollo](https://www.apollographql.com/docs/)
- [SWR](https://swr.vercel.app/)
- [React Query](https://react-query.tanstack.com/)

# How it works?

This library solves the GraphQL over HTTP problem. This means you need access to both the frontend and the backend to use this library.
It has 3 main components: A `gql` tag and `request` function to allow you to declare and fetch data from your graphql server in your frontend. A `babel` plugin to optimize your JS/TS assets so your graphql queries add ZERO bytes to your final bundle. A [codegen](https://www.graphql-code-generator.com/) plugin to generate persisted queries to your [persisted query ready graphql server](https://www.apollographql.com/docs/apollo-server/performance/apq/)

The main idea behind this module is to preprocess and aggregate all graphql queries of your frontend into a single JSON file. This file is then uploaded to the graphql server so that, when your frontend needs to query any data, it asks for the graphql server to execute a given query, instead of having to send the whole query. This is really similar to Apollo's [automatic persisted queries](https://www.apollographql.com/docs/apollo-server/performance/apq/), however, instead of gathering the queries dynamically, we preprocess and upload the queries to the server before we deploy the website. This makes some optimizations possible, like:

- ZERO bundle sizes
- Inline Fragments
- Flattened Transforms
- Redundant Node Skipping.

# Installing

Installing this plugin may vary depending on your setup. The instructions below are recommended if you are using graphql-codegen cli. If you are using graphql-codegen in a different way please refer to their docs on how to add plugins instead.

To install, just

```sh
$ yarn add @faststore/graphql-utils
```

> Note. Also make sure to install [graphql codegen cli](https://www.graphql-code-generator.com/docs/getting-started/installation)

## Adding graphql-codegen

To generate the persisted query file, add this plugin to your codegen config. If you don't have one yet, create a `codegen.yml` file with the following:

```
generates:
path/to/persisted.json:
 plugins:
   - @faststore/graphql-utils/codegen
```

Now, open your terminal and run:

```sh
$ yarn run graphql-codegen
```

This should generate a `persisted.json` file containing a map between operation names and queries. Use this file o your graphql server to filter and run queries.

## Installing on Gatsby

To use it on Gatsby, we need to setup the babel plugin. To do this, we can use Gatsby's `onCreateBabelConfig` hook on `gatsby-node.js` file. On this file add the following:

```js
// ...
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: `@faststore/graphql-utils/babel`,
    options: {},
  })
}
```

Now you should be good to go and create your queries.

# Usage

Now that you have successfully installed and configured both babel and codegen plugins, you can start writing your queries. Let's start by declaring the following code:

```tsx
import { gql, request } from '@faststore/graphql-utils'

const MyQuery = gql`
  query MyQuery { ... }
`

request({ operationName: MyQuery, variables: {} }).then((response) => {
  const { data, errors } = response

  console.log('GraphQL data and errors', { data, errors })
})
```

This code import two helpers from our lib, `gql` and `request`. Use the first one to wrap query declarations. Use the result of this expression to feed the `operationName` parameter of `request`.
That's it! you can use this in most GraphQL Clients, like Apollo Client, SWR, and React Query. Also, this is compatible with your favorite frameworks like Next.JS and Gatsby.

For instance, to use it with SWR, you can declare a useQuery hook:

```tsx
import { request } from '@faststore/graphql-utils'

const useQuery = ({ operationName, variables }) =>
  useSWR(`/graphql/${operationName}::${JSON.stringify(variables)}`, {
    fetcher: () => request({ operationName }),
  })
```

and use it on your code like:

```tsx
import { gql } from '@faststore/graphql-utils'

const MyQuery = qql`
  query MyQuery { ... }
`

const useMyQuery = (variables) =>
  useQuery({ operationName: MyQuery, variables })
```
