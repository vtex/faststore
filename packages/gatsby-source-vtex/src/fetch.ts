import { Product, Category } from './types'
import { getCatalogSystem } from './utils'

export const ProductSearch = getCatalogSystem<Product>(
  ({ tenant }) => `products/search?_from=0&_to=9&an${tenant}`
)
export const CategoryTree = getCatalogSystem<Category>(
  ({ tenant }) => `category/tree/1?an=${tenant}`
)
