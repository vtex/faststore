import { SourceNodesArgs } from 'gatsby'

import { Category, Product, Binding } from './types'

const parseProductToDataNode = (product: Product) => ({
  ...product,
  slug: `/${product.linkText}/p`,
  categoryId: Number(product.categoryId),
})

export const createProductNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  product: Product
) => {
  const NODE_TYPE = 'Product'
  const data = parseProductToDataNode(product)

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.productId}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}

export const createCategoryNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { id, children, ...category }: Category
) => {
  const NODE_TYPE = 'Category'
  const urlSplited = category.url.split('/')
  const slug = urlSplited[urlSplited.length - 1]
  const data = {
    ...category,
    slug,
    categoryId: Number(id),
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.categoryId}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}

export const createBindingNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { extraContext, ...binding }: Binding
) => {
  const NODE_TYPE = 'Binding'
  const data = {
    salesChannel: extraContext?.portal?.salesChannel,
    ...binding,
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

export const createCategorySearchResultNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  category: Category,
  products: Product[]
) => {
  const NODE_TYPE = 'CategorySearchResult'
  const urlSplited = category.url.split('/')
  const slug = urlSplited[urlSplited.length - 1]
  const data = {
    slug,
    categoryId: Number(category.id),
    products: products.map(parseProductToDataNode).map((product) => ({
      ...product,
      id: createNodeId(`${NODE_TYPE}-${product.productId}`),
    })),
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.categoryId}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}
