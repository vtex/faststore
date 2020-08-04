import { wrapSchema, introspectSchema } from '@graphql-tools/wrap'
import { AsyncExecutor } from '@graphql-tools/delegate'
import { print, printSchema } from 'graphql'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Tenant } from './types'
import { createChannelNode } from './utils'

const getGraphQLUrl = (tenant: string) =>
  `http://gimenes--${tenant}.myvtex.com/graphql`

interface Options extends PluginOptions, VTEXOptions {}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const { tenant } = options
  const {
    actions: { addThirdPartySchema },
  } = args

  /**
   * VTEX GraphQL API
   * */

  // Create executor to run queries against schema
  const url = getGraphQLUrl(tenant)

  const executor: AsyncExecutor = async ({ document, variables }) => {
    const query = print(document)
    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })
    return fetchResult.json()
  }

  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  })

  addThirdPartySchema({ schema })

  /**
   * VTEX HTTP API fetches
   * */

  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )

  bindings.forEach((binding) => createChannelNode(args, binding))
}
