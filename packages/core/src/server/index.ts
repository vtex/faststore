/* eslint-disable react-hooks/rules-of-hooks */
import {
  envelop,
  MaskError,
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
  getContextFactory,
  getResolvers,
  isFastStoreError,
} from '@faststore/api'
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { TypeSource } from '@graphql-tools/utils'
import * as GraphQLJS from 'graphql'
import { GraphQLError } from 'graphql'
import path from 'path'

import persisted from '@generated/persisted-documents.json'

import thirdPartyResolvers from '../customizations/src/graphql/thirdParty/resolvers'
import vtexExtensionsResolvers from '../customizations/src/graphql/vtex/resolvers'

import { Operation } from '../sdk/graphql/request'
import { apiOptions } from './options'

interface ExecuteOptions<V = Record<string, unknown>> {
  operation: Operation
  variables: V
  query?: string | null
}

const persistedQueries = new Map(Object.entries(persisted))

const apiContextFactory = getContextFactory(apiOptions)

const customFormatError: MaskError = (err) => {
  if (err instanceof GraphQLError && isFastStoreError(err.originalError)) {
    return err
  }

  console.error(err)

  return new GraphQLError('Sorry, something went wrong.')
}

function loadGeneratedSchema(): TypeSource {
  return loadFilesSync(path.join(process.cwd(), '@generated'), {
    extensions: ['graphql'],
  })
}

function getFinalAPISchema() {
  const generatedSchema = loadGeneratedSchema()
  const nativeResolvers = getResolvers(apiOptions)

  return makeExecutableSchema({
    typeDefs: generatedSchema,
    resolvers: [nativeResolvers, vtexExtensionsResolvers, thirdPartyResolvers],
  })
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

  const query = maybeQuery ?? persistedQueries.get(operationHash)

  if (query == null) {
    throw new Error(
      `No query found for operationName ${operationName} and operationHash ${operationHash}`
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
