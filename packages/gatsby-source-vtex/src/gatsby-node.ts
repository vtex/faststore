import './setup'

import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { CategoryTree, ProductSearch } from './fetch'
import { createCategoryNode, createProductNode } from './utils'

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: PluginOptions
) => {
  // PRODUCT
  const productData = await ProductSearch(options)
  productData.forEach((product) => createProductNode(args, product))

  // CATEGORY
  const categoryData = await CategoryTree(options)
  categoryData.forEach((category) => createCategoryNode(args, category))
}
