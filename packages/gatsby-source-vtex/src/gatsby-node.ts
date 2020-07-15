import './setup'

import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import {
  Category,
  Product,
  Tenant,
  Facets,
  Facet,
  PageType,
  RawFacets,
} from './types'
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

      // Fetch Products in the category
      let products: Product[] = []

      if (prerenderCategory.has(id)) {
        products = await fetchVTEX<Product[]>(
          api.search({ from: 0, to: 11, categoryIds: [id] }),
          options
        )
      }

      // Fatch department's facets
      const url = new URL(category.url)
      const rawFacets = await fetchVTEX<RawFacets>(
        api.facets({ department: url.pathname.slice(1, url.pathname.length) }),
        options
      )

      // Fix facet's brands
      const brands = await Promise.all(
        rawFacets.Brands?.map(async ({ Value, Name, Quantity }) => {
          const { id: brandId } = await fetchVTEX<PageType>(
            api.pageType(Value),
            options
          )

          return {
            name: Name,
            id: Number(brandId),
            quantity: Quantity,
          }
        }) ?? []
      )

      return {
        ...category,
        products,
        facets: {
          ...rawFacets,
          brands,
        },
      }
    })
  )

  categoriesWithProducts.forEach((category) =>
    createCategoryNode(args, category)
  )
}
