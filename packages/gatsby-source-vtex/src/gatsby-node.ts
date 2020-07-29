import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

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

  // VTEX Context
  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )

  bindings.forEach((binding) => createChannelNode(args, binding))
}
