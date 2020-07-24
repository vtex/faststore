import { map } from 'bluebird'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Category, PageType, Product, RawFacets, Tenant } from './types'
import {
  createCategoryNode,
  createChannelNode,
  createProductNode,
} from './utils'

interface Options extends PluginOptions, VTEXOptions {
  getStaticPaths?: () => Promise<string[]>
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const { tenant, getStaticPaths } = options
  const staticPaths =
    typeof getStaticPaths === 'function' ? await getStaticPaths() : []

  const staticPathsSet = new Set(staticPaths)

  // VTEX Context
  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )

  bindings.forEach((binding) => createChannelNode(args, binding))

  // Create all PRODUCT Nodes
  await map(
    staticPaths,
    async (path) => {
      const splitted = path.split('/')

      if (path.endsWith('/p') && splitted.length === 3) {
        const [product] = await fetchVTEX<Product[]>(
          api.search({ slug: splitted[1] }),
          options
        )

        createProductNode(args, product)
      }
    },
    { concurrency: 20 }
  )

  // CATEGORY
  const categoryData = await fetchVTEX<Category[]>(
    api.catalog.category.tree(1),
    options
  )

  const activesCategories = categoryData.filter(
    (category) => !category.name.includes('[Inactive]')
  )

  const categoriesWithProducts = await Promise.all(
    activesCategories.map(async (category) => {
      const id = category.id.toString()
      const url = new URL(category.url)

      // Fetch Products in the category
      let products: Product[] = []

      if (staticPathsSet.has(url.pathname)) {
        products = await fetchVTEX<Product[]>(
          api.search({ from: 0, to: 7, categoryIds: [id] }),
          options
        )
      }

      // Fatch department's facets
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
