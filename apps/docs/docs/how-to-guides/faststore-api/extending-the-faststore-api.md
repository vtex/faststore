# Extending the GraphQL schema

:::caution WIP
This documentation is currently under development.
:::

GraphQL is a very versatile language. By using the exported `getSchema` function, you can not only extend the base schema but also redefine the whole resolvers implementation.

To extend the schema, one can:

```ts
import { getSchema, getTypeDefs } from '@faststore/api'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { ApolloServer } from 'apollo-server'

// Setup type extensions
const typeDefs = `
  extend type StoreProduct {
    customField: String
  }
`

// Setup custom resolvers
const resolvers = {
  StoreProduct: {
    customField: async () => {
      ...
      // Your code goes here
      ...
    }
  }
}

const storeApiSchema = getSchema({ platform: 'vtex', ...})

// Merge custom TypeDefs with the ones from @faststore/api
const mergedTypeDefs = mergeTypeDefs([getTypeDefs(), typeDefs])

const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [
      await storeApiSchema,
      makeExecutableSchema({
        resolvers,
        typeDefs: mergedTypeDefs,
      }),
    ],
    resolvers,
  })

// Merge schemas into a final schema
const finalSchema = getMergedSchemas()

// Setup Apollo Server
const server = new ApolloServer({ finalSchema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```
