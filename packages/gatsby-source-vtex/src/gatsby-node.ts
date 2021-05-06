import {
  FilterObjectFields,
  introspectSchema,
  PruneSchema,
  wrapSchema,
} from '@graphql-tools/wrap'
import { print } from 'graphql'
import pMap from 'p-map'
import type { AsyncExecutor } from '@graphql-tools/delegate'
import type {
  GatsbyNode,
  PluginOptions,
  SourceNodesArgs,
  CreatePageArgs,
  PluginOptionsSchemaArgs,
} from 'gatsby'

import { api } from './api'
import { fetchVTEX } from './fetch'
import { md5 } from './md5'
import { assertRedirects } from './redirects'
import defaultStaticPaths from './staticPaths'
import {
  createChannelNode,
  createDepartmentNode,
  createStaticPathNode,
  normalizePath,
} from './utils'
import type { VTEXOptions } from './fetch'
import type { Category, PageType, Redirect, Tenant } from './types'

const getGraphQLUrl = (tenant: string, workspace: string) =>
  `http://${workspace}--${tenant}.myvtex.com/graphql`

export interface Options extends PluginOptions, VTEXOptions {
  /**
   * @description function to return the paths to statically generate
   * */
  getStaticPaths?: () => Promise<string[]>
  /**
   * @description function to return the redirects to generate in our infra. Note that these are server-side redirects
   * */
  getRedirects?: () => Promise<Redirect[]>
  pageTypes?: Array<PageType['pageType']>
  ignorePaths?: string[]
  concurrency?: number
  /**
   * @description max number of paths for getStaticPaths to generate
   * */
  maxNumPaths?: number
}

const DEFAULT_PAGE_TYPES_WHITELIST = [
  'Product',
  'Department',
  'Category',
  'Brand',
  'SubCategory',
]

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const {
    tenant,
    workspace,
    getStaticPaths,
    pageTypes: pageTypesWhitelist = DEFAULT_PAGE_TYPES_WHITELIST,
    concurrency = 20,
    ignorePaths = [],
  } = options

  const {
    actions: { addThirdPartySchema },
    reporter,
  } = args

  let activity = reporter.activityTimer(
    '[gatsby-source-vtex]: adding VTEX GraphQL Schema'
  )

  activity.start()

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

  const schema = wrapSchema(
    {
      schema: await introspectSchema(executor),
      executor,
    },
    [
      // Filter CMS fields so people use the VTEX CMS plugin instead of this one
      new FilterObjectFields(
        (typeName, fieldName) => typeName !== 'VTEX' || fieldName !== 'pages'
      ),
      new PruneSchema({}),
    ]
  )

  addThirdPartySchema({ schema })

  activity.end()

  /**
   * VTEX HTTP API fetches
   * */

  // Bindings
  activity = reporter.activityTimer(
    '[gatsby-source-vtex]: fetching VTEX Bindings'
  )
  activity.start()

  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )

  for (const binding of bindings) {
    createChannelNode(args, binding)
  }

  activity.end()

  // Catetgories
  activity = reporter.activityTimer(
    '[gatsby-source-vtex]: fetching VTEX Departments'
  )
  activity.start()

  const departments = await fetchVTEX<Category[]>(
    api.catalog.category.tree(1),
    options
  )

  for (const department of departments) {
    createDepartmentNode(args, department)
  }

  activity.end()

  /**
   * Static Paths used to generate pages
   */

  activity = reporter.activityTimer(
    '[gatsby-source-vtex]: fetching StaticPaths'
  )

  activity.start()

  const staticPaths = (typeof getStaticPaths === 'function'
    ? await getStaticPaths()
    : await defaultStaticPaths(options)
  )
    .map(normalizePath)
    .filter((path) => !ignorePaths.includes(path))

  const fetchPageTypes = async (path: string): Promise<PageType> => {
    const isProduct = /\/(.)+\/p$/g

    // When the page is a product page, we skip calling the pageType backend to speedup the process considerably.
    // This makes us have to synthetically generate some data. However, it shouldn't be a problem since we don't
    // use these synthetic attributes
    if (isProduct.test(path)) {
      return {
        id: md5(path),
        name: path.split('/p')[0],
        url: path,
        title: '',
        metaTagDescription: '',
        pageType: 'Product',
      }
    }

    return fetchVTEX<PageType>(api.catalog.portal.pageType(path), options)
  }

  const pageTypes = await pMap(staticPaths, fetchPageTypes, { concurrency })

  if (pageTypes.length !== staticPaths.length) {
    reporter.panicOnBuild(
      '[gatsby-source-vtex]: Length of PageTypes and staticPaths do not agree. No static path will be generated'
    )

    return
  }

  for (let it = 0; it < pageTypes.length; it++) {
    const pageType = pageTypes[it]
    const staticPath = staticPaths[it]

    if (!pageTypesWhitelist.includes(pageType.pageType)) {
      reporter.warn(
        `[gatsby-source-vtex]: Dropping path. Reason: PageType API reported ${pageType.pageType} for path: ${staticPath}`
      )

      continue
    }

    createStaticPathNode(args, pageType, staticPath)
  }

  activity.end()
}

export const createPages = async (
  { actions: { createRedirect }, reporter }: CreatePageArgs,
  { tenant, workspace, environment, getRedirects }: Options
) => {
  /**
   * Create all proxy rules for VTEX Store
   * If adding a new rule, don't forget to modify ./gatsby-config.ts dev proxy
   * so it also works in dev mode
   */

  if (typeof getRedirects === 'function') {
    const activity = reporter.activityTimer(
      '[gatsby-source-vtex]: sourcing Redirects'
    )

    activity.start()

    const redirects = await getRedirects()

    assertRedirects(redirects)

    for (const redirect of redirects) {
      createRedirect(redirect)
    }

    activity.end()
  }

  // Redirect API
  createRedirect({
    fromPath: '/api/io/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  createRedirect({
    fromPath: '/api/*',
    toPath: `https://${tenant}.${environment}.com.br/api/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  // Use legacy checkout
  createRedirect({
    fromPath: '/checkout/*',
    toPath: `https://${tenant}.${environment}.com.br/checkout/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  // Use Render's legacy extensions
  createRedirect({
    fromPath: '/legacy_extensions/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/legacy_extensions/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  // Static assets checkout uses
  createRedirect({
    fromPath: '/arquivos/*',
    toPath: `https://${tenant}.vtexassets.com/arquivos/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  createRedirect({
    fromPath: '/files/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/files/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  // Use graphql-gateway from VTEX IO
  createRedirect({
    fromPath: '/graphql/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/graphql/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  // Use sitemap from VTEX
  createRedirect({
    fromPath: '/sitemap.xml',
    toPath: `https://${workspace}--${tenant}.myvtex.com/sitemap.xml`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  createRedirect({
    fromPath: '/sitemap/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/sitemap/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
    },
  })

  // Some people use XMLData integration via their main domains
  createRedirect({
    fromPath: '/XMLData/*',
    toPath: `https://${tenant}.${environment}.com.br/XMLData/:splat`,
    statusCode: 200,
    proxyHeaders: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$origin_host',
      via: "''",
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
    getStaticPaths: Joi.function().arity(0),
    getRedirects: Joi.function().arity(0),
    pageTypes: Joi.array().items(Joi.string()),
    maxNumPaths: Joi.number(),
  })
