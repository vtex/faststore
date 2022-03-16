import express from 'express'
import { graphqlHTTP } from 'express-graphql'

import { getSchema, getContextFactory } from '../dist'

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

export default app
