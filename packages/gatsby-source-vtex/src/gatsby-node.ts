import './setup'

import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { ProductSearch, CategoryTree, ProductsByCategory } from './fetch'
import { createProductNode, createCategoryNode } from './utils'

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: PluginOptions
) => {
  // PRODUCT
  const productData = await ProductSearch(options)
  productData.forEach((product) => createProductNode(args, product))

  // CATEGORY
  const categoryData = await CategoryTree(options)
  categoryData.forEach(async (category) => {
    createCategoryNode(args, category)

    // GET THE FIRST 10 PRODUCTS BY THIS CATEGORY
    const productsByCategory = await ProductsByCategory({
      ...options,
      categoryId: category.id,
    })

    productsByCategory.forEach((product) => createProductNode(args, product))
  })
}
