import './setup'

import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { ProductSearch, CategoryTree } from './fetch'

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  options: PluginOptions
) => {
  // PRODUCT
  const PRODUCT_NODE_TYPE = 'Product'
  const productData = await ProductSearch(options)
  productData.forEach((product) => {
    const data = {
      ...product,
      slug: `${product.linkText}/p`,
    }
    createNode({
      ...data,
      id: createNodeId(`${PRODUCT_NODE_TYPE}-${data.productId}`),
      internal: {
        type: PRODUCT_NODE_TYPE,
        content: JSON.stringify(data),
        contentDigest: createContentDigest(data),
      },
    })
  })
  // CATEGORY
  const CATEGORY_NODE_TYPE = 'Category'
  const categoryData = await CategoryTree(options)
  categoryData.forEach(({ id, children, ...category }) => {
    const urlSplited = category.url.split('/')
    const slug = urlSplited[urlSplited.length - 1]
    const data = {
      ...category,
      slug,
      categoryId: id,
    }
    createNode({
      ...data,
      id: createNodeId(`${CATEGORY_NODE_TYPE}-${id}`),
      internal: {
        type: CATEGORY_NODE_TYPE,
        content: JSON.stringify(data),
        contentDigest: createContentDigest(data),
      },
    })
  })
}
