import express from 'express'
import { graphqlHTTP } from 'express-graphql'

import { getContextFactory, getSchema } from '../src'
import type { Options } from '../src'

const serverPort = '4000'

const apiOptions = {
  platform: 'vtex',
  account: 'arcaplanet',
  locale: 'it-IT',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
} as Options

const graphQLContext = getContextFactory(apiOptions)

const app = express()

app.use(express.json())

app.use(
  '/graphql',
  graphqlHTTP(async () => {
    const schema = await getSchema(apiOptions)

    return {
      schema,
      context: graphQLContext({}),
      graphiql: true,
      pretty: true,
    }
  })
)

app.listen(serverPort)

// eslint-disable-next-line no-console
console.log(`🚀 GraphQL server ready at http://localhost:${serverPort}/graphql`)
