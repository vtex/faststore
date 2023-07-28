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

export const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [
      await nativeApiSchema,
      getVtexExtensionsSchema(),
      getThirdPartyExtensionsSchema(),
    ].filter(Boolean),
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

export function getCustomSchema(
  customTypeDefs: string[],
  resolvers: resolversType,
  mergedTypes: string[] = []
) {
  const typeDefs = mergeTypeDefs([
    ...(Array.isArray(mergedTypes) ? mergedTypes : [mergedTypes]),
    customTypeDefs,
  ])

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  return schema
}

export function getTypeDefsFromFolder(customPath: string | string[]) {
  const basePath = ['src', 'customizations', 'graphql']

  const pathArray = Array.isArray(customPath) ? customPath : [customPath]

  return (
    loadFilesSync([...basePath, ...pathArray, 'typeDefs'], {
      extensions: ['graphql'],
    }) ??
    loadFilesSync([...basePath, ...pathArray, 'typedefs'], {
      extensions: ['graphql'],
    })
  )
}

export function getVtexExtensionsSchema() {
  const vtexTypeDefs = getTypeDefsFromFolder('vtex')

  return getCustomSchema(vtexTypeDefs, vtexExtensionsResolvers, getTypeDefs())
}

export function getThirdPartyExtensionsSchema() {
  const thirdPartyTypeDefs = getTypeDefsFromFolder('thirdParty')

  return getCustomSchema(thirdPartyTypeDefs, thirdPartyResolvers)
}
