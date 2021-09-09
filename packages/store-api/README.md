# @vtex/store-api

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
yarn add @vtex/store-api
```

## Usage
GraphQL is very versatile and can run in many places. To setup the schema in an apollo server, just:
```ts
import { getSchema } from '@vtex/store-api'
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
