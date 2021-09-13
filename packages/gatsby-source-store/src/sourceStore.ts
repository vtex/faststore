import {
  buildNodeDefinitions,
  compileNodeQueries,
  createSchemaCustomization as toolkitCreateSchemaCustomization,
  generateDefaultFragments,
  sourceAllNodes,
  sourceNodeChanges,
} from 'gatsby-graphql-source-toolkit'
import { execute, parse } from 'graphql'
import type { SourceNodesArgs } from 'gatsby'
import type {
  IGatsbyNodeConfig,
  ISourcingConfig,
} from 'gatsby-graphql-source-toolkit/dist/types'

import { RelayForward } from './paginate'
import type { Options } from './gatsby-node'

interface Args {
  gatsbyApi: SourceNodesArgs
  pluginOptions: Options
  gatsbyNodeTypes: IGatsbyNodeConfig[]
  maxItems: number
  lastBuildTime: number | undefined
}

export const sourceStoreType = async ({
  gatsbyApi,
  pluginOptions: options,
  gatsbyNodeTypes,
  maxItems,
  lastBuildTime,
}: Args) => {
  // Step1. Set up remote schema
  const [schema, contextFactory] = await Promise.all([
    options.getSchema(),
    options.getContextFactory(),
  ])

  // Step3. Provide (or generate) fragments with fields to be fetched
  const fragments = generateDefaultFragments({ schema, gatsbyNodeTypes })

  // Step4. Compile sourcing queries
  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  })

  const config: ISourcingConfig = {
    gatsbyApi,
    schema,
    execute: async (args) => {
      const response = await execute({
        operationName: args.operationName,
        document: parse(args.query),
        variableValues: args.variables,
        contextValue: contextFactory({}),
        schema,
      })

      if (response.errors?.length) {
        response.errors.forEach((e) => console.error(e))
      }

      return response
    },
    gatsbyTypePrefix: ``,
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
    paginationAdapters: [RelayForward(maxItems)],
  }

  // Step5. Add explicit types to gatsby schema
  await toolkitCreateSchemaCustomization(config)

  // Step6. Source nodes
  if (lastBuildTime) {
    await sourceNodeChanges(config, { nodeEvents: [] })
  } else {
    await sourceAllNodes(config)
  }
}
