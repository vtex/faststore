# @faststore/api

The only API you need for building your next ecommerce. 

This package defines a front-end first, GraphQL API inspired by clean architecture and schema.org. 

GraphQL types defined in this repo extends and simplifies schema.org. This makes it easier to make your frontend search friendly.
Also, by using the clean architecture, all types defined on this schema are not platform specific, but created to resolve an specific business case on your frontend, like rendering listprices, sellers etc.

Alongside the GraphQL type definitions, we provide standard implementations for common ecommerce platforms. Currently we support:
1. VTEX
2. Maybe add yours? 

With the typedefs and resolvers, you can create an executable schema and deploy anywhere you want. For instance, one use case would be:
1. Create an Apollo Server instane on Heroku
2. Run the executable schema in a function on Next.JS
3. Run the executable schema during a Gatsby build.

## Install

```bash
yarn add @faststore/api
```

## Usage
GraphQL is very versatile and can run in many places. To setup the schema in an apollo server, just:
```ts
import { getSchema } from '@faststore/api'
import { ApolloServer } from 'apollo-server'

// Get the Store schema
const schema = await getSchema({ platform: 'vtex', account: 'my-account', environment: 'vtexcommercestable' })

// Setup Apollo Server
const server = new ApolloServer({ schema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

## Extending the schema
GraphQL is a very versatile language. By using the exported `getSchema` function, you can not only extend the base schema but also redefine the whole resolvers implementation.

To extend the schema, one can:
```ts
import { getSchema } from '@faststore/api'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server'

// Setup type extensions
const typeDefs = `
extend type Product {
  customField: String!
}
`

// Setup custom resolvers
const resolvers = {
  Product: {
    customField: async () => {
      ...
      // Your code goes here
      ...
    }
  }
}

// Create custom schema
const customSchema = makeExecutableSchema({ resolvers, typeDefs })
const storeApiSchema = await getSchema({ platform: 'vtex', ...})

// Merge schemas into a final schema
const finalSchema = mergeSchemas(schemas: [
  storeApiSchema,
  customSchema
])

// Setup Apollo Server
const server = new ApolloServer({ schema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

## Inline platform
If your ecommerce platform is not supported you have two options.
1. Make a contribution
2. Create inline resolvers for your platform

Inline resolves means you are going to write all resolvers for the api schema in your project or in an external library. This is recommended if you are supporting a niche platform and want to have full control over how each field is processed.

To create your own resolvers, you can:
```ts
import { getTypeDefs } from '@faststore/api'
import { ApolloServer } from 'apollo-server'
import { makeExecutableSchema } from '@graphql-tools/schema'

// Get the Store API TypeDefs
const typeDefs = getTypeDefs()

const resolvers = {
  ...
  // add your resolvers
  ...
}

// Create a runnable schema
const schema = makeExecutableSchema({ resolvers, typeDefs })

// You now have a runnable GraphQL schema, you can create a server or run queries locally.
```
