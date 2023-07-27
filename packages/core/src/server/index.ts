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
import { GraphQLError } from 'graphql'
import path from 'path'

import vtexExtensionsResolvers from '../customizations/graphql/vtex/resolvers'
import thirdPartyResolvers from '../customizations/graphql/thirdParty/resolvers'

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

const customSchemas = getCustomSchemas()

export const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [await nativeApiSchema, ...customSchemas].filter(Boolean),
  })

export const apiSchema = getMergedSchemas()

const apiContextFactory = getContextFactory(apiOptions)

const formatError: FormatErrorHandler = (err) => {
  if (err instanceof GraphQLError && isFastStoreError(err.originalError)) {
    return err
  }

  console.error(err)

  return new GraphQLError('Sorry, something went wrong.')
}

export const getEnvelop = async () =>
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

type resolversType = Parameters<typeof makeExecutableSchema>[0]['resolvers']

function getCustomSchema(
  pathMap: string | string[],
  resolvers: resolversType,
  mergedTypes: string[] = []
) {
  const pathArray = Array.isArray(pathMap) ? pathMap : [pathMap]

  const basePath = ['src', 'customizations', 'graphql']

  const customTypeDefs =
    loadCustomTypeDefs(path.join(...basePath, ...pathArray, 'typeDefs')) ??
    loadCustomTypeDefs(path.join(...basePath, ...pathArray, 'typedefs'))

  const typeDefs = mergeTypeDefs([
    ...(Array.isArray(mergedTypes) ? mergedTypes : [mergedTypes]),
    customTypeDefs,
  ])

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  return [schema, typeDefs] as const
}

function loadCustomTypeDefs(customPath: string) {
  return loadFilesSync(customPath, {
    extensions: ['graphql'],
  })
}

function getCustomSchemas() {
  const [vtexExtensionsSchema, vtexExtensionsTypeDefs] = getCustomSchema(
    'vtex',
    vtexExtensionsResolvers,
    getTypeDefs()
  )

  const [thirdPartySchema, thirdPartyTypeDefs] = getCustomSchema(
    'thirdParty',
    thirdPartyResolvers
  )

  return [vtexExtensionsSchema, thirdPartySchema]
}
