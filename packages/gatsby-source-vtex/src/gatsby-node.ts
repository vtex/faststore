import { ensureDir, writeFile } from 'fs-extra'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'
import {
  buildNodeDefinitions,
  compileNodeQueries,
  createDefaultQueryExecutor,
  createSchemaCustomization,
  loadSchema,
  readOrGenerateDefaultFragments,
} from 'gatsby-graphql-source-toolkit'
import { IQueryExecutor } from 'gatsby-graphql-source-toolkit/dist/types'
import { print, DocumentNode } from 'graphql'
import { join } from 'path'
import { inspect } from 'util'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Tenant } from './types'
import { createChannelNode } from './utils'

const getGraphQLUrl = (tenant: string) =>
  `http://gimenes--${tenant}.myvtex.com/graphql`

const debugDir = join(process.cwd(), `/.cache/gatsby-source-vtex/queries`)
const fragmentsDir = join(process.cwd(), `/.cache/gatsby-source-vtex/fragments`)

interface Options extends PluginOptions, VTEXOptions {
  getStaticPaths?: () => Promise<string[]>
}

type Entity = 'Product' | 'Search'

const pathToEntity = (path: string): Entity | null => {
  const splitted = path.split('/')

  if (path === '/') {
    return null
  }

  if (splitted.length === 3 && path.endsWith('/p')) {
    return 'Product'
  }

  if (splitted.length >= 2) {
    return 'Search'
  }

  throw new Error(`Unroutable route: ${path}`)
}

const writeCompiledQueries = async (nodeDocs: Map<string, DocumentNode>) => {
  await ensureDir(debugDir)
  for (const [remoteTypeName, document] of nodeDocs) {
    await writeFile(debugDir + `/${remoteTypeName}.graphql`, print(document))
  }
}

const createSourcingConfig = async (
  args: SourceNodesArgs,
  executor: IQueryExecutor
) => {
  // Step1. Setup remote schema:
  const schema = await loadSchema(executor)

  // Step2. Configure Gatsby node types
  const gatsbyNodeTypes = [
    {
      remoteTypeName: `Product`,
      remoteIdFields: [`__typename`, `productId`],
      queries: `query GetProductBySlug($slug: String) { product(slug: $slug) }`,
    },
  ]

  // Step3. Provide (or generate) fragments with fields to be fetched
  await ensureDir(fragmentsDir)
  const fragments = await readOrGenerateDefaultFragments(fragmentsDir, {
    schema,
    gatsbyNodeTypes,
  })

  // Step4. Compile sourcing queries
  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  })

  // Write compiled queries for debugging
  await writeCompiledQueries(documents)

  const config = {
    gatsbyApi: args,
    schema,
    execute: executor,
    gatsbyTypePrefix: '',
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
  }

  // Step5. Add explicit types to gatsby schema
  await createSchemaCustomization(config)

  return config
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const {
    reporter,
    actions: { createNode },
    createNodeId,
    createContentDigest,
  } = args
  const { tenant, getStaticPaths } = options
  const staticPaths =
    typeof getStaticPaths === 'function' ? await getStaticPaths() : []

  /**
   * VTEX GraphQL API fetches
   * */

  // Create executor to run queries against schema
  const url = getGraphQLUrl(tenant)
  const executor = createDefaultQueryExecutor(url, {}, { concurrency: 30 })

  const config = await createSourcingConfig(args, executor)

  // Source nodes from schema
  const progress = reporter.createProgress(
    'Sourcing Nodes from VTEX GraphQL API',
    staticPaths.length
  )
  await Promise.all(
    staticPaths.map(async (staticPath) => {
      const entity = pathToEntity(staticPath)

      // Skip known route
      if (entity === null) {
        progress.tick(1)
        return null
      }

      if (entity === 'Product') {
        const { document } = config.gatsbyNodeDefs.get(entity)!
        const payload = {
          query: print(document),
          document,
          variables: {
            slug: staticPath,
          },
          operationName: 'GetProductBySlug',
        }

        console.log({ query: print(document) })

        const response = await executor(payload)

        if (response.errors) {
          throw new Error(
            `Something went wrong while fetching ${
              payload.operationName
            } ${inspect(response.errors, false, 10, true)}`
          )
        }

        if (!response.data) {
          throw new Error(
            `Possible error detected: An empty data was returned for path: ${staticPath}`
          )
        }

        createNode({
          ...response.data,
          id: createNodeId(`${entity}-${response.data!.product.productId}`),
          internal: {
            type: entity,
            content: JSON.stringify(response.data),
            contentDigest: createContentDigest(response.data!),
          },
        })
      }

      if (entity === 'Search') {
        console.log('to implement Search')
      }
    })
  )

  /**
   * VTEX HTTP API fetches
   * */

  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )

  bindings.forEach((binding) => createChannelNode(args, binding))
}
