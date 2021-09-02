import type { SourceNodesArgs } from 'gatsby'
import {
  buildNodeDefinitions,
  compileNodeQueries,
  generateDefaultFragments,
  createSchemaCustomization as toolkitCreateSchemaCustomization,
  sourceAllNodes,
} from 'gatsby-graphql-source-toolkit'
import { execute, parse } from 'graphql'
import type { ISourcingConfig } from 'gatsby-graphql-source-toolkit/dist/types'

import type { Options } from './gatsby-node'

export const sourceProducts = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  // Step1. Set up remote schema:
  const schema = await options.getSchema()

  // Step2. Configure Gatsby node types
  const gatsbyNodeTypes = [
    {
      remoteTypeName: `Product`,
      queries: `
      # Write your query or mutation here
        query LIST_PRODUCTS($first: number, $after: number) {
          allProducts {
            products {
              ..._ProductFragment_
            }
          }
        }
        fragment _ProductFragment_ on Product {
          id: productID
          __typename
        }
      `,
    },
  ]

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
    execute: async (args) =>
      execute({ ...args, document: parse(args.query), schema }),
    gatsbyTypePrefix: ``,
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
  }

  // Step5. Add explicit types to gatsby schema
  await toolkitCreateSchemaCustomization(config)

  // Step6. Source nodes
  await sourceAllNodes(config)
}
