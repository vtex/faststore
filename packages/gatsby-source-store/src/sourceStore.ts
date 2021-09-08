import {
  buildNodeDefinitions,
  compileNodeQueries,
  createSchemaCustomization as toolkitCreateSchemaCustomization,
  generateDefaultFragments,
  sourceAllNodes,
} from 'gatsby-graphql-source-toolkit'
import { execute, parse } from 'graphql'
import type { SourceNodesArgs } from 'gatsby'
import type {
  IGatsbyNodeConfig,
  ISourcingConfig,
} from 'gatsby-graphql-source-toolkit/dist/types'

import type { Options } from './gatsby-node'
import { RelayForward } from './paginate'

export const sourceStoreType = async (
  gatsbyApi: SourceNodesArgs,
  options: Options,
  gatsbyNodeTypes: IGatsbyNodeConfig[],
  maxItems: number
) => {
  // Step1. Set up remote schema:
  const schema = await options.getSchema()

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
  await sourceAllNodes(config)
}
