import './setup'

import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Category, Product, Tenant } from './types'
import {
  createBindingNode,
  createCategoryNode,
  createCategorySearchResultNode,
  createProductNode,
} from './utils'

type Options = PluginOptions & VTEXOptions

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const { tenant } = options

  // VTEX Context
  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )
  bindings.forEach((binding) => createBindingNode(args, binding))

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
  activesCategories.forEach((category) => createCategoryNode(args, category))

  // CATEGORY SEARCH
  const categorySearches = await Promise.all(
    activesCategories.map(async (category) => {
      const products = await fetchVTEX<Product[]>(
        api.search.byFilters({
          from: 0,
          to: 9,
          categoryIds: [`${category.id}`],
        }),
        options
      )
      return {
        products,
        category,
      }
    })
  )

  categorySearches.forEach(({ products, category }) =>
    createCategorySearchResultNode(args, category, products)
  )
}
