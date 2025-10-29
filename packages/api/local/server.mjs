import { useLogger, useMaskedErrors } from '@envelop/core'
import { useGraphQlJit } from '@envelop/graphql-jit'
import { useParserCache } from '@envelop/parser-cache'
import { useValidationCache } from '@envelop/validation-cache'
import { getContextFactory, getSchema } from '@vtex/faststore-api'
import { createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
const serverPort = process.env.PORT ?? '4000'

/** @type {import("../src").Options} */
const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  locale: 'en-US',
  environment: 'vtexcommercestable',
  channel:
    '{"salesChannel":"1","regionId":"","hasOnlyDefaultSalesChannel":"true"}',
  showSponsored: false,
}

const yoga = createYoga({
  schema: getSchema(),
  context: getContextFactory(apiOptions),
  plugins: [
    useMaskedErrors({
      maskError: (err) => {
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
const server = createServer(yoga)

// Start the server and you're done!
server.listen(serverPort, () => {
  console.info(
    `🚀 GraphQL server ready at http://localhost:${serverPort}/graphql`
  )
})
