import camelcase from 'camelcase'
import type { ParentSpanPluginArgs } from 'gatsby'

import { PLUGIN } from '../../constants'
import type { RemotePageContent, Block, PageContent } from './types'

export const getTypeName = (name: string) =>
  camelcase(['cms', name], { pascalCase: true })

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

export const nodeId = (node: RemotePageContent): string =>
  `${getTypeName(node.type)}:${node.remoteId}`

export const sourceNode = (
  gatsbyApi: ParentSpanPluginArgs,
  node: RemotePageContent
) => {
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
    id: gatsbyApi.createNodeId(nodeId(node)),
    name: node.name,
    sections: node.blocks,
    ...extra,
  } as PageContent

  gatsbyApi.actions.createNode(
    {
      ...data,
      internal: {
        type: getTypeName(node.type),
        content: JSON.stringify(data),
        contentDigest: gatsbyApi.createContentDigest(data),
      },
    },
    { name: PLUGIN }
  )
}

export const deleteNode = (
  gatsbyApi: ParentSpanPluginArgs,
  remoteNode: RemotePageContent
) => {
  const id = nodeId(remoteNode)
  const node = gatsbyApi.getNode(id)

  gatsbyApi.actions.deleteNode(node)
}
