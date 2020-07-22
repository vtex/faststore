import { api, FilterOptions, Product } from '@vtex/gatsby-source-vtex'

import { jsonFetcher } from '../../utils/fetcher'

export const fetcher = (filters: FilterOptions) => {
  const url = api.search(filters)

  return jsonFetcher<Product[]>(url)
}
