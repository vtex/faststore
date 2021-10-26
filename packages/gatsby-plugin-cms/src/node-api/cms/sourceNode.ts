import camelcase from 'camelcase'
import type { ParentSpanPluginArgs } from 'gatsby'

import { PLUGIN } from '../../constants'
import type { TransformedContent } from './fetchNodes'
import type { PageContent } from './types'

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
  nodes: TransformedContent[]
) => {
  const getType = (node: TransformedContent) => `
    type ${getTypeName(node.contentType.id)} implements Node {
      id: String!
      name: String!
      sections: [CmsBlock!]!
    }
    `

  const types = Array.from(new Set(nodes.map(getType)))

  const typeDefs = [baseSchema, ...types].join('\n')

  gatsbyApi.actions.createTypes(typeDefs)
}

export const nodeId = (node: TransformedContent): string =>
  `${getTypeName(node.contentType.id)}:${node.remoteId}`

export const sourceNode = (
  gatsbyApi: ParentSpanPluginArgs,
  node: TransformedContent
) => {
  const extra = node.variant.configurationDataSets?.reduce(
    (acc, { name, configurations }) => ({
      ...acc,
      [camelcase(name)]: configurations?.reduce(
        (ac, block) => ({ ...ac, [camelcase(block.name)]: block.props }),
        {} as Record<string, any>
      ),
    }),
    {} as Record<string, Record<string, any>>
  )

  const data = {
    id: gatsbyApi.createNodeId(nodeId(node)),
    name: node.name,
    sections: node.variant.sections,
    ...extra,
  } as PageContent

  gatsbyApi.actions.createNode(
    {
      ...data,
      internal: {
        type: getTypeName(node.contentType.id),
        content: JSON.stringify(data),
        contentDigest: gatsbyApi.createContentDigest(data),
      },
    },
    { name: PLUGIN }
  )
}

export const deleteNode = (
  gatsbyApi: ParentSpanPluginArgs,
  remoteNode: TransformedContent
) => {
  const id = nodeId(remoteNode)
  const node = gatsbyApi.getNode(id)

  gatsbyApi.actions.deleteNode(node)
}
