import {
  envelop,
  useEngine,
  useExtendContext,
  useLogger,
  useMaskedErrors,
  useSchema,
} from '@envelop/core'
import { useGraphQlJit } from '@envelop/graphql-jit'
import { useParserCache } from '@envelop/parser-cache'
import { useValidationCache } from '@envelop/validation-cache'
import type { GraphQLSchema } from 'graphql'
import * as GraphQLJS from 'graphql'
import { GraphQLError } from 'graphql'
import { BadRequestError, isFastStoreError } from './platforms/errors'
import type { Options } from './platforms/vtex'
import { getContextFactory } from './schema'

const getEnvelop = async (
  options: Options,
  schema: GraphQLJS.GraphQLSchema,
  customContextFactory?: Parameters<typeof useExtendContext>[0]
) => {
  // enables including any values to the graphql context
  let contextFactory = getContextFactory(options)
  if (customContextFactory) {
    contextFactory = (ctx: any) => {
      return {
        ...ctx,
        ...customContextFactory(ctx),
        ...getContextFactory(options)(ctx),
      }
    }
  }

  return envelop({
    plugins: [
      useEngine(GraphQLJS),
      useSchema(schema),
      useExtendContext(contextFactory),
      useMaskedErrors({
        maskError: (err: unknown) => {
          if (
            err instanceof GraphQLError &&
            isFastStoreError(err.originalError)
          ) {
            return err
          }

          console.error(err)

          return new GraphQLError(`Sorry, something went wrong. ${err}`)
        },
      }),
      useGraphQlJit(),
      useValidationCache(),
      useParserCache(),
      useLogger({
        logFn: (eventName, { args }) =>
          console.log(
            `${eventName}(${args?.operationName ?? 'unknown_operation_name'}): ${JSON.stringify(args?.variableValues)}`
          ),
      }),
    ],
  })
}

export const GraphqlExecute = (
  options: Options,
  schema: GraphQLSchema,
  persistedQueries: Map<string, string>,
  customContextFactory?: Parameters<typeof useExtendContext>[0]
) => {
  const envelopPromise = getEnvelop(options, schema, customContextFactory)

  return async <V extends { [k in string]: unknown } | null, Data>(
    options: Parameters<GraphqlRunner<V, Data>>[0],
    envelopContext = { headers: {} }
  ) => {
    if (!options?.operation?.['__meta__'])
      console.log('Invalid query:', JSON.stringify(options))

    const { operation, variables, query: maybeQuery } = options
    const { operationHash, operationName } = operation?.['__meta__'] ?? {}

    const query = maybeQuery ?? persistedQueries.get(operationHash ?? '')

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
    } = await enveloped(envelopContext)

    const contextValue = await contextFactory(envelopContext)

    const { data, errors } = (await run({
      schema: schema,
      document: parse(query),
      variableValues: variables,
      contextValue,
      operationName,
    })) as { data: Data; errors: unknown[] }

    return {
      data,
      errors,
      extensions: {
        cookies: (contextValue as any).storage.cookies,
        // @TODO: fix this contextValue.cachecontrol type inference
        cacheControl: (contextValue as any).cacheControl ?? undefined,
      },
    }
  }
}
