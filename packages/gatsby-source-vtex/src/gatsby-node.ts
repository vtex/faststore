import { readFile as readFileAsync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

import {
  FilterObjectFields,
  introspectSchema,
  PruneSchema,
  RenameTypes,
  wrapSchema,
} from '@graphql-tools/wrap'
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

import { api } from './api'
import { fetchVTEX } from './fetch'
import { ProductPaginationAdapter } from './graphql/pagination/product'
import { getExecutor } from './graphql/executor'
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
  'Department',
  'Category',
  'Brand',
  'SubCategory',
]

const readFile = promisify(readFileAsync)

/**
 * Add VTEX GraphQL API as 3p schema.
 *
 * VTEX schema contains some extra fields that should not be queryable by pages, like
 * the `pages` field. This field contains the VTEX CMS data and is already handled by
 * gatsby-plugin-cms.
 *
 * Also, we remove the `product` field from type VTEX for two reasons:
 * 1. This field must return type StoreProduct instead of the original VTEX_Product so our type
 * generation works correctly with user defined queries and fragments
 * 2. Because we can't allow pages to query this field during SSG so we can't correctly use Gatsby's
 * data model for incremental site generation
 */
export const createSchemaCustomization = async (
  args: CreateSchemaCustomizationArgs,
  options: Options
) => {
  const {
    reporter,
    actions: { addThirdPartySchema },
  } = args

  const activity = reporter.activityTimer(
    '[gatsby-source-vtex]: adding VTEX Gateway GraphQL Schema'
  )

  activity.start()

  // Create executor to run queries against schema
  const executor = getExecutor(options)

  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
    transforms: [
      // Filter CMS fields so people use the VTEX CMS plugin instead of this one
      new FilterObjectFields(
        (typeName, fieldName) =>
          !(
            typeName === 'VTEX' &&
            (fieldName === 'pages' || fieldName === 'product')
          )
      ),
      new PruneSchema({}),
    ],
  })

  addThirdPartySchema({ schema }, { name: 'gatsby-source-vtex' })

  activity.end()
}

/**
 * Creates dummy resolvers so we don't allow developers to query for these fields
 * during SSG and uses the Gatsby data model correctly
 */
export const createResolvers = ({
  createResolvers: createGatsbyResolvers,
}: CreateResolversArgs) => {
  const resolvers = {
    VTEX: {
      product: {
        type: 'StoreProduct!',
        args: {
          slug: 'String!',
          regionId: 'String',
        },
        resolve: () => {
          throw new Error('Client-side only route. Can not be used on SSG')
        },
      },
    },
  }

  createGatsbyResolvers(resolvers)
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const {
    tenant,
    getStaticPaths,
    pageTypes: pageTypesWhitelist = DEFAULT_PAGE_TYPES_WHITELIST,
    concurrency = 20,
    ignorePaths = [],
  } = options

  const { reporter } = args

  /** Reset last build time on this machine */
  const lastBuildTime = await args.cache.get(`LAST_BUILD_TIME`)

  await args.cache.set(`LAST_BUILD_TIME`, Date.now())

  const promisses = [] as Array<() => Promise<void>>

  /**
   * Add VTEX bindings
   */
  promisses.push(async () => {
    const activity = reporter.activityTimer(
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
  })

  /**
   * Add VTEX categories
   */
  promisses.push(async () => {
    const activity = reporter.activityTimer(
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
  })

  /**
   * Static Paths used to generate pages
   */
  promisses.push(async () => {
    let activity = reporter.activityTimer(
      '[gatsby-source-vtex]: fetching StaticPaths'
    )

    activity.start()

    const staticPaths = (typeof getStaticPaths === 'function'
      ? await getStaticPaths()
      : await defaultStaticPaths(options)
    )
      .map(normalizePath)
      .filter((path) => !ignorePaths.includes(path))

    activity.end()

    activity = reporter.activityTimer(
      '[gatsby-source-vtex]: fetching PageTypes'
    )

    activity.start()

    const fetchPageTypes = async (path: string): Promise<PageType> => {
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
  })

  /**
   * Source products so we can use Gatsby's file system route api for creating pages.
   * https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/
   *
   * Also, the steps below follow the tutorial from gatsby-source-toolkit.
   * Take a look at their docs for more info
   * https://github.com/gatsbyjs/gatsby-graphql-toolkit#how-it-works
   */
  promisses.push(async () => {
    // Step1. Set up remote schema:
    const executor = getExecutor(options)
    const gatewaySchema = await introspectSchema(executor)
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
        # Write your query or mutation here
          query LIST_PRODUCTS($from: number, $to: number) {
            vtex {
              productSearch(
                orderBy: "orders:desc",
                from: $from,
                to: $to
                simulationBehavior: skip
              ){
                products {
                  ..._ProductFragment_
                }
              }
            }
          }
          fragment _ProductFragment_ on Product {
            id: productId
            __typename
          }
        `,
      },
    ]

    // Step3. Provide (or generate) fragments with fields to be fetched
    const fragments = new Map()
    const ProductFragment = await readFile(
      join(__dirname, '../src/graphql/fragments/ProductFragment.graphql')
    )

    fragments.set('Product', ProductFragment.toString())

    // Step4. Compile sourcing queries
    const documents = compileNodeQueries({
      schema,
      gatsbyNodeTypes,
      customFragments: fragments,
    })

    // Define how to execute a query into the schema
    const run = wrapQueryExecutorWithQueue(async (opts) =>
      execute({
        schema,
        document: parse(opts.query),
        operationName: opts.operationName,
        variableValues: opts.variables,
      })
    )

    const config: ISourcingConfig = {
      gatsbyApi: args,
      schema,
      execute: run,
      gatsbyTypePrefix: `Store`,
      gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
      paginationAdapters: [ProductPaginationAdapter],
    }

    // Step5. Add explicit types to gatsby schema
    await toolkitCreateSchemaCustomization(config)

    // Step6. Source nodes either from delta changes or scratch
    if (lastBuildTime) {
      reporter.info(
        '[gatsby-source-vtex]: CACHE FOUND! We are about to go FAST! Skipping FETCH'
      )
      const nodeEvents: NodeEvent[] = []

      await sourceNodeChanges(config, { nodeEvents })
    } else {
      reporter.info(
        '[gatsby-source-vtex]: No cache found. Sourcing all data from scratch'
      )
      await sourceAllNodes(config)
    }
  })

  await Promise.all(promisses.map((x) => x()))
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
      searches: { nodes: searches },
      allStoreProduct: { totalCount: pdps },
    },
  } = await graphql<any>(`
    query GetAllStaticPaths {
      searches: allStaticPath(
        filter: {
          pageType: { in: ["Department", "Category", "Brand", "SubCategory"] }
        }
      ) {
        nodes {
          id
          path
          pageType
        }
      }
      allStoreProduct {
        totalCount
      }
    }
  `)

  reporter.info(`[gatsby-source-vtex]: Available pdps: ${pdps}`)
  reporter.info(`[gatsby-source-vtex]: Available plps: ${searches.length}`)

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
