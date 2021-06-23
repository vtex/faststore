import { readFile as readFileAsync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

import { PruneSchema, RenameTypes, wrapSchema } from '@graphql-tools/wrap'
import {
  buildNodeDefinitions,
  compileNodeQueries,
  createSchemaCustomization as toolkitCreateSchemaCustomization,
  sourceAllNodes,
  sourceNodeChanges,
  wrapQueryExecutorWithQueue,
} from 'gatsby-graphql-source-toolkit'
import { execute, parse } from 'graphql'
import pMap from 'p-map'
import type { GraphQLResolveInfo } from 'graphql'
import type {
  GatsbyNode,
  PluginOptions,
  SourceNodesArgs,
  CreatePagesArgs,
  PluginOptionsSchemaArgs,
  CreateSchemaCustomizationArgs,
  CreateResolversArgs,
} from 'gatsby'
import type {
  ISourcingConfig,
  NodeEvent,
} from 'gatsby-graphql-source-toolkit/dist/types'

import { getDelegateToSchema } from './graphql/delegate'
import { api } from './api'
import { fetchVTEX } from './fetch'
import { ProductPaginationAdapter } from './graphql/pagination/product'
import { md5 } from './md5'
import { assertRedirects } from './redirects'
import defaultStaticPaths from './staticPaths'
import {
  createChannelNode,
  createDepartmentNode,
  createStaticPathNode,
  normalizePath,
} from './utils'
import { getExecutor, getGatewaySchema } from './graphql/schema'
import type { VTEXOptions } from './fetch'
import type { Category, PageType, Redirect, Tenant } from './types'
import { getResolvers } from './graphql/resolvers'

const readFile = promisify(readFileAsync)

const PLUGIN_NAME = 'gatsby-source-vtex'

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
  unstable_fastSourcing?: boolean
}

const DEFAULT_PAGE_TYPES_WHITELIST = [
  'Product',
  'Department',
  'Category',
  'Brand',
  'SubCategory',
]

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  gatsbyAPI: SourceNodesArgs,
  options: Options
) => {
  const {
    tenant,
    workspace,
    getStaticPaths,
    pageTypes: pageTypesWhitelist = DEFAULT_PAGE_TYPES_WHITELIST,
    concurrency = 20,
    ignorePaths = [],
    unstable_fastSourcing: fastSourcing,
  } = options

  const { reporter } = gatsbyAPI

  const promisses = [] as Array<() => Promise<void>>

  const lastBuildTime = await gatsbyAPI.cache.get(`LAST_BUILD_TIME`)

  /** Reset last build time */
  promisses.push(async () => gatsbyAPI.cache.set(`LAST_BUILD_TIME`, Date.now()))

  /**
   * Add VTEX bindings
   */
  promisses.push(async () => {
    const activity = reporter.activityTimer(
      `[${PLUGIN_NAME}]: fetching VTEX Bindings`
    )

    activity.start()

    const { bindings } = await fetchVTEX<Tenant>(
      api.tenants.tenant(tenant),
      options
    )

    for (const binding of bindings) {
      createChannelNode(gatsbyAPI, binding)
    }

    activity.end()
  })

  /**
   * Add VTEX categories
   */
  promisses.push(async () => {
    const activity = reporter.activityTimer(
      `[${PLUGIN_NAME}]: fetching VTEX Departments`
    )

    activity.start()

    const departments = await fetchVTEX<Category[]>(
      api.catalog.category.tree(1),
      options
    )

    for (const department of departments) {
      createDepartmentNode(gatsbyAPI, department)
    }

    activity.end()
  })

  /**
   * Static Paths used to generate pages
   */
  if (!fastSourcing) {
    promisses.push(async () => {
      let activity = reporter.activityTimer(
        `[${PLUGIN_NAME}]: fetching StaticPaths`
      )

      activity.start()

      const staticPaths = (typeof getStaticPaths === 'function'
        ? await getStaticPaths()
        : await defaultStaticPaths(options)
      )
        .map(normalizePath)
        .filter((path) => !ignorePaths.includes(path))

      activity.end()

      activity = reporter.activityTimer(`[${PLUGIN_NAME}]: fetching PageTypes`)

      activity.start()

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
          `[${PLUGIN_NAME}]: Length of PageTypes and staticPaths do not agree. No static path will be generated`
        )

        return
      }

      for (let it = 0; it < pageTypes.length; it++) {
        const pageType = pageTypes[it]
        const staticPath = staticPaths[it]

        if (!pageTypesWhitelist.includes(pageType.pageType)) {
          reporter.warn(
            `[${PLUGIN_NAME}]: Dropping path. Reason: PageType API reported ${pageType.pageType} for path: ${staticPath}`
          )

          continue
        }

        createStaticPathNode(gatsbyAPI, pageType, staticPath)
      }

      activity.end()
    })
  }

  /**
   * Source Products
   */
  if (fastSourcing) {
    promisses.push(async () => {
      // Step1. Set up remote schema:
      const executor = getExecutor(options)
      const gatewaySchema = await getGatewaySchema(options)
      const schema = wrapSchema({
        schema: gatewaySchema,
        executor,
        transforms: [
          new RenameTypes((typeName: string) => {
            const newTypeName = typeName.replace('VTEX_', '')
            const isTypeNameAvailable = !gatewaySchema.getType(newTypeName)

            return isTypeNameAvailable ? newTypeName : typeName
          }),
          new PruneSchema(),
        ],
      })

      // Step2. Configure Gatsby node types
      const gatsbyNodeTypes = [
        {
          remoteTypeName: `Product`,
          queries: `
            query LIST_PRODUCTS($from: number, $to: number) {
              vtex {
                productSearch(
                  orderBy: "orders:desc",
                  from: $from,
                  to: $to
                ){
                  products {
                    ..._StoreProductFragment_
                  }
                }
              }
            }

            fragment _StoreProductFragment_ on Product {
              id: productId
              __typename
            }
          `,
        },
      ]

      // Step3. Provide (or generate) fragments with fields to be fetched
      const fragments = new Map()
      const productFragment = await readFile(
        join(__dirname, '../graphql/fragments/ProductFragment.graphql')
      )

      fragments.set('Product', `${productFragment}`)

      // Step4. Compile sourcing queries
      const documents = compileNodeQueries({
        schema,
        gatsbyNodeTypes,
        customFragments: fragments,
      })

      // Step5. Define how to execute a query against the schema with transforms
      const run = wrapQueryExecutorWithQueue(async (opts) =>
        execute({
          schema,
          document: parse(opts.query),
          operationName: opts.operationName,
          variableValues: opts.variables,
        })
      )

      const config: ISourcingConfig = {
        gatsbyApi: gatsbyAPI,
        schema,
        execute: run,
        gatsbyTypePrefix: `Store`,
        gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
        paginationAdapters: [ProductPaginationAdapter],
      }

      // Step6. Add explicit types to gatsby schema
      await toolkitCreateSchemaCustomization(config)

      // Step7. Source nodes either from delta changes or scratch

      if (lastBuildTime) {
        reporter.info(
          `[${PLUGIN_NAME}]: Cache found! We are about to go fast! Sourcing only changed data`
        )
        const nodeEvents: NodeEvent[] = []

        await sourceNodeChanges(config, { nodeEvents })
      } else {
        reporter.info(
          `[${PLUGIN_NAME}]: No cache found. Sourcing all data from scratch`
        )
        await sourceAllNodes(config)
      }
    })
  }

  await Promise.all(promisses.map((x) => x()))
}

export const createSchemaCustomization = async (
  args: CreateSchemaCustomizationArgs
) => {
  const {
    actions: { createTypes },
  } = args

  const typeDefs = await readFile(join(__dirname, '../graphql/schema.graphql'))

  createTypes(typeDefs.toString(), { name: PLUGIN_NAME })
}

export const createResolvers = async (
  gatsbyAPI: CreateResolversArgs,
  options: Options
) => {
  const { createResolvers: createResolversAPI } = gatsbyAPI

  const resolvers = await getResolvers(options)

  createResolversAPI(resolvers)
}

export const createPages = async (
  { actions: { createRedirect }, graphql, reporter }: CreatePagesArgs,
  { tenant, workspace, environment, getRedirects }: Options
) => {
  /**
   * Report available PDPs and PLPs
   */
  const {
    data: {
      allStoreProduct: { totalCount },
    },
  } = await graphql<any>(`
    query GetAllStaticPaths {
      allStoreProduct {
        totalCount
      }
    }
  `)

  reporter.info(`[${PLUGIN_NAME}]: Available Products: ${totalCount}`)

  /**
   * Create all proxy rules for VTEX Store
   * If adding a new rule, don't forget to modify ./gatsby-config.ts dev proxy
   * so it also works in dev mode
   */

  if (typeof getRedirects === 'function') {
    const activity = reporter.activityTimer(
      `[${PLUGIN_NAME}]: sourcing Redirects`
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
    unstable_fastSourcing: Joi.boolean(),
  })
