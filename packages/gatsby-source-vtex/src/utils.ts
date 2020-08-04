import { SourceNodesArgs } from 'gatsby'

import { Category, Product, Channel } from './types'
export const createChannelNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { extraContext, ...channel }: Channel
) => {
  const NODE_TYPE = 'Channel'
  const data = {
    salesChannel: extraContext?.portal?.salesChannel,
    ...channel,
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.id}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}
