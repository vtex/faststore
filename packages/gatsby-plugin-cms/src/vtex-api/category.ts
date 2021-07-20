import type { Options } from '../gatsby-node'
import { fetchJson } from '../utils'
import { api } from './api'

export interface Category {
  parentID: null | number
  globalCategoryID: number
  globalCategoryName: string
  position: number
  slug: string
  id: number
  name: string
  hasChildren: boolean
  url: string
  title: string
  metaTagDescription: string
}

export const category = {
  id: (id: string, options: Options): Promise<Category> =>
    fetchJson(api(options).catalog.category.id(id)),
}
