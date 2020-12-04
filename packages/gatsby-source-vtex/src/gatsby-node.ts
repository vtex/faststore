import { AsyncExecutor } from '@graphql-tools/delegate'
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap'
import { print } from 'graphql'
import {
  GatsbyNode,
  PluginOptions,
  SourceNodesArgs,
  CreatePageArgs,
  PluginOptionsSchemaArgs,
} from 'gatsby'

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

export const createPage = (
  { actions: { createRedirect } }: CreatePageArgs,
  { tenant, workspace, environment }: Options
) => {
  // Redirect API
  createRedirect({
    fromPath: '/api/io/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/api/*',
    toPath: `https://${tenant}.${environment}.com.br/api/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  // Use legacy checkout
  createRedirect({
    fromPath: '/checkout/*',
    toPath: `https://${tenant}.${environment}.com.br/checkout/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  // Static assets checkout uses
  createRedirect({
    fromPath: '/arquivos/*',
    toPath: `https://${tenant}.vtexassets.com/arquivos/:splat`,
    statusCode: 200,
  })

  createRedirect({
    fromPath: '/files/*',
    toPath: `https://${tenant}.vtexassets.com/files/:splat`,
    statusCode: 200,
  })

  // Use graphql-gateway from VTEX IO
  createRedirect({
    fromPath: '/graphql/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/graphql/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  // Use sitemap from VTEX
  createRedirect({
    fromPath: '/sitemap.xml',
    toPath: `https://${workspace}--${tenant}.myvtex.com/sitemap.xml`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/sitemap/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/sitemap/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  // Some people use XMLData integration via their main domains
  createRedirect({
    fromPath: '/XMLData/*',
    toPath: `https://${tenant}.${environment}.com.br/XMLData/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    tenant: Joi.string().required(),
    workspace: Joi.string().required(),
    environment: Joi.string().pattern(
      /^(vtexcommercestable|vtexcommercebeta)$/
    ),
  })
