import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap'
import { AsyncExecutor } from '@graphql-tools/delegate'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Tenant } from './types'
import { createChannelNode } from './utils'

interface Options extends PluginOptions, VTEXOptions {
  getStaticPaths?: () => Promise<string[]>
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const { tenant } = options
  const { addThirdPartySchema } = args

  // VTEX Context
  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )

  bindings.forEach((binding) => createChannelNode(args, binding))

  // const executor = (app: string): AsyncExecutor => async ({
  //   document,
  //   variables,
  //   context,
  // }) => {
  //   const {
  //     vtex: { account, workspace, authToken },
  //   } = (context as unknown) as Context

  //   const { name, version } = parseAppId(app)
  //   const major = versionToMajor(version)
  //   const query = print(document)

  //   const fetchResult = await fetch(
  //     `http://app.io.vtex.com/${name}/v${major}/${account}/${workspace}/_v/graphql`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: authToken,
  //         'x-vtex-locale': 'en-US',
  //         'x-vtex-tenant': 'en-US',
  //       },
  //       body: JSON.stringify({ query, variables }),
  //     }
  //   )

  //   return fetchResult.json()
  // }

  // const schema = wrapSchema(
  //   {
  //     schema: introspectionSchema,
  //     executor: linkToExecutor(link),
  //   },
  //   [new StripNonQueryTransform()]
  // )

  // addThirdPartySchema({ schema })
}
