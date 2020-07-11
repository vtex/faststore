import './setup'

import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Category, Product, Tenant } from './types'
import {
  createCategoryNode,
  createChannelNode,
  createProductNode,
} from './utils'

interface Options extends PluginOptions, VTEXOptions {
  prerender?: () => {
    categories: string[]
  }
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const { tenant, prerender } = options
  const { categories = [] } = typeof prerender === 'function' ? prerender() : {}

  // VTEX Context
  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )
  bindings.forEach((binding) => createChannelNode(args, binding))

  // PRODUCT
  const productData = await fetchVTEX<Product[]>(
    api.search({ from: 0, to: 9 }),
    options
  )
  productData.forEach((product) => createProductNode(args, product))

  // CATEGORY
  const categoryData = await fetchVTEX<Category[]>(
    api.catalog.category.tree(1),
    options
  )
  const activesCategories = categoryData.filter(
    (category) => !category.name.includes('[Inactive]')
  )

  // CATEGORIES with rendered products
  const prerenderCategory = new Set(categories)

  const categoriesWithProducts = await Promise.all(
    activesCategories.map(async (category) => {
      const id = category.id.toString()

      let products: Product[] = []
      if (prerenderCategory.has(id)) {
        products = await fetchVTEX<Product[]>(
          api.search({ from: 0, to: 9, categoryIds: [id] }),
          options
        )
      }

      return {
        ...category,
        products,
      }
    })
  )
  categoriesWithProducts.forEach((category) =>
    createCategoryNode(args, category)
  )
}
