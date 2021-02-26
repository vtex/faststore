import type { SourceNodesArgs } from 'gatsby'

import type { Category, Channel, PageType } from './types'

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
    slug: new URL(department.url).pathname,
    subCategories: children.map((subCategory) => ({
      ...subCategory,
      slug: new URL(subCategory.url).pathname,
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

export const createStaticPathNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { id, name, title, metaTagDescription, pageType }: PageType,
  path: string
) => {
  const NODE_TYPE = 'StaticPath'

  const data = {
    id,
    name,
    title,
    metaTagDescription,
    path,
    pageType,
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.id}-${data.pageType}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}

export const normalizePath = (path: string) => {
  const i = path[0] === '/' ? 1 : 0
  const j = path[path.length - 1] === '/' ? path.length - 1 : path.length

  return `/${path.slice(i, j)}`
}
