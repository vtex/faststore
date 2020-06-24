import { Product, Category } from './types'
import { getCatalogSystem } from './utils'

export const ProductSearch = getCatalogSystem<Product>(
  'products/search?_from=0&_to=9'
)
export const CategoryTree = getCatalogSystem<Category>('category/tree/1')
export const ProductsByCategory = getCatalogSystem<Product>(
  ({ categoryId }) => `products/search?fq=C:${categoryId}&map=c&_from=0&_to=9`
)
