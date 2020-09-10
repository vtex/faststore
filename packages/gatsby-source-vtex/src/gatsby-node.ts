import { AsyncExecutor } from '@graphql-tools/delegate'
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'
import { print } from 'graphql'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Category, Tenant } from './types'
import { createDepartmentNode, createChannelNode } from './utils'

const getGraphQLUrl = (tenant: string, workspace: string) =>
  `http://${workspace}--${tenant}.myvtex.com/graphql`

interface Options extends PluginOptions, VTEXOptions {}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const { tenant, workspace } = options
  const {
    actions: { addThirdPartySchema },
  } = args

  /**
   * VTEX GraphQL API
   * */

  // Create executor to run queries against schema
  const url = getGraphQLUrl(tenant, workspace)

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

    const result = await fetchResult.json()

    /**
     * We've chosen to ignore the 404 errors on build time.
     * This allows us to complete builds with slightly old slugs and
     * to handle this type of error on the client, where we will make
     * some redirects.
     */
    if (result.errors && result.errors.length > 0) {
      result.errors = result.errors.filter((error: any) => {
        console.warn(error)
        const status = error.extensions?.exception?.status

        return !status || status !== 404
      })

      if (result.errors.length === 0) {
        delete result.errors
      }
    }

    return result
  }

  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  })

  addThirdPartySchema({ schema })

  /**
   * VTEX HTTP API fetches
   * */

  // Bindings
  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )

  bindings.forEach((binding) => createChannelNode(args, binding))

  // Catetgories
  const departments = await fetchVTEX<Category[]>(
    api.catalog.category.tree(1),
    options
  )

  departments.forEach((department) => createDepartmentNode(args, department))
}
