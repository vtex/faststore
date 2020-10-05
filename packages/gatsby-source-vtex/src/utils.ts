import { SourceNodesArgs } from 'gatsby'

import { Category, Channel } from './types'

const getSlugFromUrl = (url: string) => {
  const urlSplited = url.split('/')
  const slug = urlSplited[urlSplited.length - 1]

  return slug
}

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

export const createDepartmentNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { id, children, ...department }: Category
) => {
  const NODE_TYPE = 'Department'
  const data = {
    ...department,
    slug: getSlugFromUrl(department.url),
    subCategories: children.map((subCategory) => ({
      ...subCategory,
      slug: getSlugFromUrl(subCategory.url),
    })),
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${id}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}
