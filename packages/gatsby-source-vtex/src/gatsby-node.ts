import './setup'

import { join } from 'path'

import { pathExists, readJSON } from 'fs-extra'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Category, Product, Tenant } from './types'
import {
  createCategoryNode,
  createChannelNode,
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

  const categoriesJson = join(process.cwd(), '/src/prerender/categories.json')
  const exists = await pathExists(categoriesJson)
  const categoryList = exists ? await readJSON(categoriesJson) : []
  const categoriesToPrerenderProducts = new Set(categoryList)

  console.log(categoryList)

  const categoriesWithProducts = await Promise.all(
    activesCategories.map(async (category) => {
      const id = category.id.toString()

      let products: Product[] = []
      if (categoriesToPrerenderProducts.has(id)) {
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
