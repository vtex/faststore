import express from 'express'
import { graphqlHTTP } from 'express-graphql'

import { getSchema, getContextFactory } from '../src'

const port = '4000'

const app = express()

app.use(express.json())

const graphQLContext = getContextFactory({
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '1',
})

app.use(
  '/graphql',
  graphqlHTTP(async () => {
    const schema = await getSchema({
      platform: 'vtex',
      account: 'storeframework',
      environment: 'vtexcommercestable',
      channel: '1',
    })

    return {
      schema,
      context: graphQLContext({}),
      graphiql: true,
      pretty: true,
    }
  })
)

app.listen(port)

// eslint-disable-next-line no-console
console.log(`🚀 GraphQL server ready at http://localhost:${port}/graphql`)
