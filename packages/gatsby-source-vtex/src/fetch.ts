import axios from 'axios'
import { PluginOptions } from 'gatsby'

import { Category, Product } from './types'
import { api } from './api'

const axiosOptions = {
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
}

const getVtex = <T>(path: string) => async (
  options: PluginOptions
): Promise<T[]> => {
  const url = `https://${options.tenant}.${options.environment}.com.br${path}`
  const { data } = await axios.get(url, axiosOptions)
  return data
}

export const ProductSearch = getVtex<Product>(
  api.search.byFilters({ from: 0, to: 9 })
)
export const CategoryTree = getVtex<Category>(api.catalog.category.tree(1))
