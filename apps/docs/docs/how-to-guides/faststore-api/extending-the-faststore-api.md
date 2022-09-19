# Extending the GraphQL schema

Although the [FastStore API](/reference/api/faststore-api) provides a complete [GraphQL schema for ecommerce](/reference/api/queries), some stores may need to access other, more specific, information.

For those cases, it is possible to extend the FastStore API schema, adding new data to the existing [queries](/reference/api/queries).

In this guide you will learn how to implement this in your project. You can also view a [summary](#summary) of the expected behavior and a [complete code example](#complete-code-example).

:::info
Once you have implemented the schema extension in your code, you can run a local [test with a GraphQL IDE](/how-to-guides/faststore-api/explore-the-faststore-api).
:::

## Step by step

To extend the GraphQL schema of your FastStore project, there are a few steps you must follow:

1. [Prepare files](#step-1---prepare-files).
2. [Create type definitions](#step-2---create-type-definitions).
3. [Create resolvers](#step-3---create-resolvers).
4. [Get FastStore API schema](#step-4---get-faststore-api-schema).
5. [Merge executable schemas](#step-5---merge-executable-schemas).
6. [Integrate with the GraphQL layer](#step-6---integrate-with-the-graphql-layer).

### Step 1 - Prepare files

The FastStore executable schema is exported by the `src/server/index.ts` file of your project. This means you must edit that same file to merge the existing schema with the one you create.

However, you have the option of creating other folders and files to organize your new [type definitions](#step-2---create-type-definitions) and [resolvers](#step-3---create-resolvers). This may be a good idea, especially if you wish to add a large number of new fields to the schema.

#### Import tools

Once you decided on your file structure, you can import the tools necessary to manipulate the schemas:

```ts
import { getSchema, getTypeDefs } from '@faststore/api'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'
import type { Options as APIOptions } from '@faststore/api'
```

### Step 2 - Create type definitions

Your new type definitions set the data structure for your new fields, extended from the existing FastStore GraphQL queries and types.

See the following code example of adding a new field called `customField`, which is a string, to the existing type [StoreProduct](/reference/api/objects#storeproduct).

```ts
const typeDefs = `
  extend type StoreProduct {
    customField: String
  }
`
```

### Step 3 - Create resolvers

Resolvers are the functions that give meaning to the data you have structured in the type definitions. This means a resolver will be executed when the corresponding piece of information is queried.

A resolver can perform an operation on an existing field or fetch data from a proprietary API, for example.

You can create your resolvers like in the following code example.

```ts
const resolvers = {
  StoreProduct: {
    customField: async () => {
      ...
      // Your code goes here
      ...
    }
  }
}
```

It is important to note that every resolver has [implicit arguments](https://graphql.org/learn/execution/#root-fields-resolvers) aside from what you define when writing your function. This includes the `root` of the type, which means your resolver has access to all information in that type.

For instance, in the example above the resolver can use whatever information is contained in the existing [StoreProduct](/reference/api/objects#storeproduct) type definition.

### Step 4 - Get FastStore API schema

To get the existing FastStore API schema, use the imported `getSchema` function. This function takes arguments in the form of the imported `APIOptions` type.

It is likely that your `src/server/index.ts` file already has this implemented like in the example below.

```ts
import { getSchema } from '@faststore/api'
import type { Options as APIOptions } from '@faststore/api'

...

const apiOptions: APIOptions = {
  platform: storeConfig.platform as APIOptions['platform'],
  account: storeConfig.api.storeId,
  environment: storeConfig.api.environment as APIOptions['environment'],
  hideUnavailableItems: storeConfig.api.hideUnavailableItems,
  channel: storeConfig.session.channel,
  locale: storeConfig.session.locale,
  flags: {
    enableOrderFormSync: true,
  },
}

export const apiSchema = getSchema(apiOptions)
```

### Step 5 - Merge executable schemas

Now it is time to make an executable schema from your newly created type definitions and resolvers and then merge that with the existing FastStore API schema.

To do this, use the imported functions `makeExecutableSchema` and `mergeSchemas` like in the example below.

```ts
import { getTypeDefs } from '@faststore/api'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'

...

// Merging your custom type definitions with the ones from @faststore/api
const mergedTypeDefs = mergeTypeDefs([getTypeDefs(), typeDefs])

const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [
      await apiSchema,
      makeExecutableSchema({
        resolvers,
        typeDefs: mergedTypeDefs,
      }),
    ],
  })

// Merging schemas into a final schema
export const finalSchema = getMergedSchemas()
```

:::caution
Note that the final merged schema in the example above has a different name than the existing exported one. You must make sure that all instances in which it is used have the correct name. For instance, you can change the name of the unextended native schema to `nativeApiSchema` and the final one to `apiSchema` which is already used in the rest of the project. An example of this is in the [complete example](#complete-code-example) below.
:::

### Step 6 - Integrate with the GraphQL layer

If you are already using the FastStore API with its native schema, it is likely that this is already coded on your `src/server/index.ts` file. The main goal at this point is to make sure you are passing the extended schema, not the native one.

The example below is based on the [Base store starters](/starters/base) which use [Envelop](https://www.envelop.dev/).

```ts
const getEnvelop = async () =>
  envelop({
    plugins: [
      useAsyncSchema(apiSchema), // Pass extended schema name here.
      useExtendContext(apiContextFactory),
      useMaskedErrors({ formatError }),
      useGraphQlJit(),
      useValidationCache(),
      useParserCache(),
    ],
  })
```

However, there are different ways to enrich your GraphQL execution layer, such as using [Apollo](https://www.apollographql.com/) instead of Envelop, each with its implementation specification. Whatever technology you decide to use, ensure you are passing the extended schema.

### Complete code example

The example below contains all code described in the sections above as it might be implemented in a single file, `src/server/index.ts`. It covers the consolidated code you have seen above, which are modifications and additions to the existing code, not the complete resulting file.

:::info
As indicated above, this example contains adjusted schema names, so as not to break anything that was already using the exported schema.
:::

```ts
import { getSchema, getTypeDefs } from '@faststore/api'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'
import type { Options as APIOptions } from '@faststore/api'

...

// Creating type definitions
const typeDefs = `
  extend type StoreProduct {
    customField: String
  }
`

// Creating resolvers
const resolvers = {
  StoreProduct: {
    customField: async () => {
      ...
      // Your code goes here
      ...
    }
  }
}

// Getting existing FastStore API schema
const apiOptions: APIOptions = {
  platform: storeConfig.platform as APIOptions['platform'],
  account: storeConfig.api.storeId,
  environment: storeConfig.api.environment as APIOptions['environment'],
  hideUnavailableItems: storeConfig.api.hideUnavailableItems,
  channel: storeConfig.session.channel,
  locale: storeConfig.session.locale,
  flags: {
    enableOrderFormSync: true,
  },
}

const nativeApiSchema = getSchema(apiOptions)

// Merging your custom type definitions with the ones from @faststore/api
const mergedTypeDefs = mergeTypeDefs([getTypeDefs(), typeDefs])

const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [
      await nativeApiSchema,
      makeExecutableSchema({
        resolvers,
        typeDefs: mergedTypeDefs,
      }),
    ],
  })

// Merging schemas into a final schema
export const apiSchema = getMergedSchemas()

...

// Integrating schema with the GraphQL execution layer
const getEnvelop = async () =>
  envelop({
    plugins: [
      useAsyncSchema(apiSchema), // Pass extended schema name here.
      useExtendContext(apiContextFactory),
      useMaskedErrors({ formatError }),
      useGraphQlJit(),
      useValidationCache(),
      useParserCache(),
    ],
  })

...

```

## Summary

After completing the steps above, the FastStore GraphQL API schema of your project will be extended and you will be able to use your custom API fields in your store. See these other guides to learn how to [test your schema using a GraphQL IDE](/how-to-guides/faststore-api/explore-the-faststore-api) and [fetch API information in your storefront](/how-to-guides/faststore-api/fetching-api-data).
