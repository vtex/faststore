/* eslint-disable react-hooks/rules-of-hooks */
import type { FormatErrorHandler } from '@envelop/core'
import {
  envelop,
  useAsyncSchema,
  useExtendContext,
  useMaskedErrors,
} from '@envelop/core'
import { useGraphQlJit } from '@envelop/graphql-jit'
import { useParserCache } from '@envelop/parser-cache'
import { useValidationCache } from '@envelop/validation-cache'
import type { Options as APIOptions, CacheControl, Maybe } from '@faststore/api'
import {
  getContextFactory,
  getSchema,
  getTypeDefs,
  isFastStoreError,
} from '@faststore/api'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import fs from 'fs'
import { GraphQLError, print } from 'graphql'
import path from 'path'

import extensionsResolvers from 'src/customizations/graphql/extensions/resolvers'

import persisted from '../../@generated/graphql/persisted.json'
import storeConfig from '../../faststore.config'

interface ExecuteOptions<V = Record<string, unknown>> {
  operationName: string
  variables: V
  query?: string | null
}

const persistedQueries = new Map(Object.entries(persisted))

const apiOptions: APIOptions = {
  platform: storeConfig.platform as APIOptions['platform'],
  account: storeConfig.api.storeId,
  environment: storeConfig.api.environment as APIOptions['environment'],
  hideUnavailableItems: storeConfig.api.hideUnavailableItems,
  incrementAddress: storeConfig.api.incrementAddress,
  channel: storeConfig.session.channel,
  locale: storeConfig.session.locale,
  flags: {
    enableOrderFormSync: true,
  },
}

export const nativeApiSchema = getSchema(apiOptions)

const extensionsSchema = getExtensionsSchema()

const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [await nativeApiSchema, extensionsSchema].filter(Boolean),
  })

// Merging schemas into a final schema
export const apiSchema = getMergedSchemas()

const apiContextFactory = getContextFactory(apiOptions)

const formatError: FormatErrorHandler = (err) => {
  if (err instanceof GraphQLError && isFastStoreError(err.originalError)) {
    return err
  }

  console.error(err)

  return new GraphQLError('Sorry, something went wrong.')
}

const getEnvelop = async () =>
  envelop({
    plugins: [
      useAsyncSchema(apiSchema),
      useExtendContext(apiContextFactory),
      useMaskedErrors({ formatError }),
      useGraphQlJit(),
      useValidationCache(),
      useParserCache(),
    ],
  })

const envelopPromise = getEnvelop()

export const execute = async <V extends Maybe<{ [key: string]: unknown }>, D>(
  options: ExecuteOptions<V>,
  envelopContext = { headers: {} }
): Promise<{
  data: D
  errors: unknown[]
  extensions: { cacheControl?: CacheControl }
}> => {
  const { operationName, variables, query: maybeQuery } = options
  const query = maybeQuery ?? persistedQueries.get(operationName)

  if (query == null) {
    throw new Error(`No query found for operationName: ${operationName}`)
  }

  const enveloped = await envelopPromise
  const {
    parse,
    contextFactory,
    execute: run,
    schema,
  } = enveloped(envelopContext)

  const contextValue = await contextFactory(envelopContext)

  const { data, errors } = (await run({
    schema,
    document: parse(query),
    variableValues: variables,
    contextValue,
    operationName,
  })) as { data: D; errors: unknown[] }

  return {
    data,
    errors,
    extensions: { cacheControl: contextValue.cacheControl },
  }
}

function getExtensionsSchema() {
  const pathArray = ['src', 'customizations', 'graphql', 'extensions']
  const typeDefs = loadFilesSync(path.join(...pathArray, 'typeDefs'), {
    extensions: ['graphql'],
  })
  const faststoreApiTypeDefs = getTypeDefs()
  const mergedTypes = mergeTypeDefs([faststoreApiTypeDefs, typeDefs])

  // we don't need to create a new schema if we use the extensions data as typeDefs and resolvers from mergeSchemas()
  const schema = makeExecutableSchema({
    typeDefs: mergedTypes,
    resolvers: extensionsResolvers,
  })

  if (storeConfig.api.printSchemas) {
    const printedTypeDefs = print(mergedTypes)
    fs.writeFileSync('joined.graphql', printedTypeDefs)
  }

  return schema
}
