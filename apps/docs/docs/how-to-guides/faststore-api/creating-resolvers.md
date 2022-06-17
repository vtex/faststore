# Creating inline resolvers

:::caution WIP
This documentation is currently under development.
:::

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
