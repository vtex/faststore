import { Category, Product } from './types'
import { getCatalogSystem } from './utils'

export const ProductSearch = getCatalogSystem<Product>(
  'products/search?_from=0&_to=9'
)
export const CategoryTree = getCatalogSystem<Category>('category/tree/1')
