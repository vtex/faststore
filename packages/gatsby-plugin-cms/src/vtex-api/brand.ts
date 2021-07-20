import type { Options } from '../gatsby-node'
import { fetchJson } from '../utils'
import { api } from './api'

export interface Brand {
  id: number
  name: string
  isActive: boolean
  title: string
  metaTagDescription: string
  imageURL: null | string
}

export const brand = {
  id: (id: string, options: Options): Promise<Brand> =>
    fetchJson(api(options).catalog.brand.id(id)),
}
