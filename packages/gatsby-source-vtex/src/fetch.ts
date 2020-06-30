import { Product, Category } from './types'
import { getVtex } from './api'

export const ProductSearch = getVtex<Product>('products/search?_from=0&_to=9')
export const CategoryTree = getVtex<Category>('category/tree/1')
