import { readFile as readFileAsync } from 'fs'
import { promisify } from 'util'
import { join } from 'path'

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
  createSchemaCustomization,
  sourceAllNodes,
  sourceNodeChanges,
  wrapQueryExecutorWithQueue,
} from 'gatsby-graphql-source-toolkit'
import { execute, parse, print } from 'graphql'
import pMap from 'p-map'
import type { AsyncExecutor } from '@graphql-tools/delegate'
import type {
  GatsbyNode,
  PluginOptions,
  SourceNodesArgs,
  CreatePagesArgs,
  PluginOptionsSchemaArgs,
} from 'gatsby'
import type { IPaginationAdapter } from 'gatsby-graphql-source-toolkit'
import type {
  ISourcingConfig,
  NodeEvent,
} from 'gatsby-graphql-source-toolkit/dist/types'

import { api } from './api'
import { fetchGraphQL, fetchVTEX } from './fetch'
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

  const promisses = [] as Array<() => Promise<void>>

  // Create executor to run queries against schema
  const url = getGraphQLUrl(tenant, workspace)
  const executor: AsyncExecutor = ({ document, variables }) =>
    fetchGraphQL(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: print(document), variables }),
    })

  const gatewaySchema = await introspectSchema(executor)

  /**
   * Add VTEX GraphQL API as 3p schema
   */
  promisses.push(async () => {
    const activity = reporter.activityTimer(
      '[gatsby-source-vtex]: adding VTEX GraphQL Schema'
    )

    activity.start()

    const schema = wrapSchema({
      schema: gatewaySchema,
      executor,
      transforms: [
        // Filter CMS fields so people use the VTEX CMS plugin instead of this one
        new FilterObjectFields(
          (typeName, fieldName) => typeName !== 'VTEX' || fieldName !== 'pages'
        ),
        new PruneSchema(),
      ],
    })

    addThirdPartySchema({ schema })

    activity.end()
  })

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
  })

  /**
   * Source products
   */
  promisses.push(async () => {
    // Step1. Set up remote schema:
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
    const readFile = promisify(readFileAsync)
    const productFragment = await readFile(
      join(__dirname, '../fragments/ProductFragment.graphql')
    )

    fragments.set('Product', `${productFragment}`)

    // Step4. Compile sourcing queries
    const documents = compileNodeQueries({
      schema,
      gatsbyNodeTypes,
      customFragments: fragments,
    })

    // Define pagination adapters
    interface IProduct {
      productId: string
    }

    interface IPage {
      products: IProduct[]
    }

    const StoreProductPaginationAdapter: IPaginationAdapter<IPage, IProduct> = {
      name: 'StoreProductPaginationAdapter',
      expectedVariableNames: [`from`, `to`],
      start: () => ({
        variables: { from: 0, to: 99 },
        hasNextPage: true,
      }),
      next: (state, page) => ({
        variables: {
          from: Number(state.variables.from) + 100,
          to: Number(state.variables.to) + 100,
        },
        hasNextPage: page.products.length > 0,
      }),
      concat: (result, page) => ({
        products: result.products.concat(page.products),
      }),
      getItems: (pageOrResult) => pageOrResult.products,
    }

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
      paginationAdapters: [StoreProductPaginationAdapter],
    }

    // Step5. Add explicit types to gatsby schema
    await createSchemaCustomization(config)

    // Step6. Source nodes either from delta changes or scratch
    const lastBuildTime = await args.cache.get(`LAST_BUILD_TIME`)

    if (lastBuildTime) {
      reporter.info(
        '[gatsby-source-vtex]: Cache found! We are about to go fast! Sourcing only changed data'
      )
      const nodeEvents: NodeEvent[] = []

      await sourceNodeChanges(config, { nodeEvents })
    } else {
      reporter.info(
        '[gatsby-source-vtex]: No cache found. Sourcing all data from scratch'
      )
      await sourceAllNodes(config)
    }

    await args.cache.set(`LAST_BUILD_TIME`, Date.now())
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
      products: { nodes: products },
      allStoreProduct: { totalCount },
    },
  } = await graphql<any>(`
    query GetAllStaticPaths {
      searches: allStaticPath(
        filter: {
          pageType: { in: ["Department", "Category", "Brand", "SubCategory"] }
        }
      ) {
        nodes {
          ...staticPath
        }
      }
      products: allStaticPath(filter: { pageType: { eq: "Product" } }) {
        nodes {
          ...staticPath
        }
      }
      allStoreProduct {
        totalCount
      }
    }

    fragment staticPath on StaticPath {
      id
      path
      pageType
    }
  `)

  reporter.info(`[gatsby-source-vtex]: Available pdps: ${products.length}`)
  reporter.info(`[gatsby-source-vtex]: Available plps: ${searches.length}`)
  reporter.info(`[gatsby-source-vtex]: Available Products: ${totalCount}`)

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
