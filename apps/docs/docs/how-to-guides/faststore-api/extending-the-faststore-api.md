# Extending the GraphQL schema

Although the [FastStore API](https://www.faststore.dev/reference/api/faststore-api) provides a complete [GraphQL schema for ecommerce](https://www.faststore.dev/reference/api/queries), some stores may need to access other, more specific, information.

For those cases, it is possible to extend the FastStore API schema, adding new data to the existing [queries](https://www.faststore.dev/reference/api/queries).

:::info
Once you have implemented the schema extension in your code, you can run a local [test with GraphiQL](/how-to-guides/faststore-api/using-graphiql-to-explore-the-faststore-api).
:::

## Implementation

To do this, there are a few steps you must follow:
1. [Prepare files](#prepare-files).
2. [Create type definitions](#create-type-definitions).
3. [Create resolvers](#create-resolvers).
4. [Merge executable schemas](#merge-executable-schemas).

### Prepare files

The FastStore executable schema is exported by the `src/server/intex.ts` file. This means you must edit that same file to merge the existing schema with the one you create.

However, you have the option of creating other folders and files to organize your new [type definitions](#create-type-definitions) and [resolvers](#create-resolvers). This may be a good idea, especially if you wish to add a large number of new fields to the schema.

:::info
The examples in this tutorial assume all extension code is added to the `src/server/index.ts` file. 
:::

#### Importing tools

Once you decided on your file structure, you can import the tools necessary to manipulate the schemas:

```ts
import { getSchema, getTypeDefs } from '@faststore/api'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'
```

### Create type definitions

Type definitions

### Create resolvers

### Merge executable schemas

## Complete example

The example below contains all code described in the sections above as it might be placed in a single file, `src/server/index.ts`.



















```ts
import { getSchema, getTypeDefs } from '@faststore/api'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'

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
```
