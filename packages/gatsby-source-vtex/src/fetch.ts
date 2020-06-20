import { Product, Category } from './types'
import { getCatalogSystem } from './utils'

export const ProductSearch = getCatalogSystem<Product>('products/search')

export const CategoryTree = getCatalogSystem<Category>('category/tree/1')
