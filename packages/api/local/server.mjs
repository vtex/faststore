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
  schema: getSchema(apiOptions),
  context: getContextFactory(apiOptions),
})
const server = createServer(yoga)

// Start the server and you're done!
server.listen(serverPort, () => {
  console.info(
    `🚀 GraphQL server ready at http://localhost:${serverPort}/graphql`
  )
})
