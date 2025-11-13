import {
  envelop,
  type MaskError,
  useEngine,
  useExtendContext,
  useMaskedErrors,
  useSchema,
} from '@envelop/core'
import { useGraphQlJit } from '@envelop/graphql-jit'
import { useParserCache } from '@envelop/parser-cache'
import { useValidationCache } from '@envelop/validation-cache'
import type { CacheControl, Maybe } from '@faststore/api'
import {
  BadRequestError,
  GraphqlVtexContextFactory,
  GraphqlVtexSchema,
  isFastStoreError,
} from '@faststore/api'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { TypeSource } from '@graphql-tools/utils'
import * as GraphQLJS from 'graphql'
import { GraphQLError } from 'graphql'
import path from 'path'

import thirdPartyResolvers from '../customizations/src/graphql/thirdParty/resolvers'
import vtexExtensionsResolvers from '../customizations/src/graphql/vtex/resolvers'

import type { Operation } from '../sdk/graphql/request'
import { apiOptions } from './options'

interface ExecuteOptions<V = Record<string, unknown>> {
  operation: Operation
  variables: V
  query?: string | null
}

const persistedQueries = new Map()

const apiContextFactory = GraphqlVtexContextFactory(apiOptions)

const customFormatError: MaskError = (err) => {
  if (err instanceof GraphQLError && isFastStoreError(err.originalError)) {
    return err
  }

  console.error(err)

  return new GraphQLError(`Sorry, something went wrong. ${err}`)
}

function loadGeneratedSchema(): TypeSource {
  return loadFilesSync(path.join(process.cwd(), '@generated'), {
    extensions: ['graphql'],
  })
}

export function getFinalAPISchema() {
  const finalTypeDefs = mergeTypeDefs([
    GraphqlVtexSchema(),
    loadGeneratedSchema(),
  ])

  const schema = makeExecutableSchema({
    typeDefs: finalTypeDefs,
    resolvers: [vtexExtensionsResolvers, thirdPartyResolvers],
  })

  return GraphqlVtexSchema(schema)
}

export const getEnvelop = async () =>
  envelop({
    plugins: [
      useEngine(GraphQLJS),
      useSchema(getFinalAPISchema()),
      useExtendContext(apiContextFactory),
      useMaskedErrors({ maskError: customFormatError }),
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
  extensions: {
    cacheControl?: CacheControl
    cookies: Map<string, Record<string, string>> | null
  }
}> => {
  const { operation, variables, query: maybeQuery } = options
  const { operationHash, operationName } = operation['__meta__']

  if (!persistedQueries.size) {
    Object.entries(await import('@generated/persisted-documents.json')).forEach(
      (key, value) => persistedQueries.set(key, value)
    )
  }
  const query = maybeQuery ?? persistedQueries.get(operationHash)

  if (query == null) {
    throw new BadRequestError(
      `No query found for operationName ${operationName} and operationHash ${operationHash}.`
    )
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
    extensions: {
      cookies: contextValue.storage.cookies,
      cacheControl: contextValue.cacheControl,
    },
  }
}
