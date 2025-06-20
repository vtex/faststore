import express from 'express'
import { graphqlHTTP } from 'express-graphql'

import type { Options } from '../src'
import { getContextFactory, getSchema } from '../src'

const serverPort = '4000'

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  locale: 'en-US',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  showSponsored: false,
} as Options

const graphQLContext = getContextFactory(apiOptions)

const app = express()

app.use(express.json())

app.use(
  '/graphql',
  graphqlHTTP(async (req) => {
    const schema = await getSchema(apiOptions)

    return {
      schema,
      context: graphQLContext({
        headers: req.headers,
      }),
      graphiql: true,
      pretty: true,
    }
  })
)

app.listen(serverPort)

console.log(`🚀 GraphQL server ready at http://localhost:${serverPort}/graphql`)
