import camelcase from 'camelcase'
import type { ParentSpanPluginArgs } from 'gatsby'

import { PLUGIN } from '../constants'
import type { RemotePageContent, Block, PageContent } from './types'

const getTypeName = (name: string) => camelcase(['cms', name])

const baseSchema = `
scalar JSONPropsCmsObject

type CmsBlock {
  name: String!
  props: JSONPropsCmsObject!
}
`

export const createSchemaCustomization = (
  gatsbyApi: ParentSpanPluginArgs,
  nodes: RemotePageContent[]
) => {
  const getType = (node: RemotePageContent) => `
    type ${getTypeName(node.type)} implements Node {
      id: String!
      name: String!
      sections: [CmsBlock!]!
    }
    `

  const types = Array.from(new Set(nodes.map(getType)))

  const typeDefs = [baseSchema, ...types].join('\n')

  gatsbyApi.actions.createTypes(typeDefs)
}

export const sourceNode = async (
  gatsbyApi: ParentSpanPluginArgs,
  node: RemotePageContent
) => {
  const type = getTypeName(node.type)
  const createNodeId = (id: string) => gatsbyApi.createNodeId(`${type}:${id}`)

  const extra = node.extraBlocks.reduce(
    (acc, { name, blocks }) => ({
      ...acc,
      [camelcase(name)]: blocks.reduce(
        (ac, block) => ({ ...ac, [camelcase(block.name)]: block.props }),
        {} as Record<string, Block['props']>
      ),
    }),
    {} as Record<string, Record<string, Block['props']>>
  )

  const data = {
    id: createNodeId(node.id),
    name: node.name,
    sections: node.blocks,
    ...extra,
  } as PageContent

  gatsbyApi.actions.createNode(
    {
      ...data,
      internal: {
        type,
        content: JSON.stringify(data),
        contentDigest: gatsbyApi.createContentDigest(data),
      },
    },
    { name: PLUGIN }
  )
}
