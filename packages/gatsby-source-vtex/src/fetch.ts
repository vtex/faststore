import { PluginOptions } from 'gatsby'

import { Category, Product } from './types'
import { getCatalogSystem } from './utils'

export const ProductSearch = getCatalogSystem<Product>(
  'products/search?_from=0&_to=9'
)
export const CategoryTree = async (
  options: PluginOptions
): Promise<Category[]> =>
  getCatalogSystem<Category>('category/tree/1')(options).then((categories) =>
    categories.filter((c) => !c.name.includes('[Inactive]'))
  )
