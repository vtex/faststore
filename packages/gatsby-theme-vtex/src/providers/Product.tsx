import { api, FilterOptions, Product } from '@vtex/gatsby-source-vtex'
import { useMemo } from 'react'
import useSWR from 'swr'

import { jsonFetcher } from '../utils/fetcher'
import { useSalesChannel } from './SalesChannel'

export type AsyncProduct = Product

const NULL_PRODUCT = [null]

export const useAsyncProduct = (filterOptions: FilterOptions) => {
  const [salesChannel] = useSalesChannel()
  const { data, isValidating } = useSWR<AsyncProduct[]>(
    api.search(filterOptions, {
      sc: salesChannel,
      simulation: 'true',
    }),
    {
      fetcher: jsonFetcher,
      suspense: false,
    }
  )
  const isLoading = !data && isValidating
  const [product] = data ?? NULL_PRODUCT
  return { product, isLoading }
}

export const useSku = (product: AsyncProduct | null, skuId?: string) => {
  return useMemo(() => {
    if (!product) {
      return
    }
    return (
      product.items.find(({ itemId }) => itemId === skuId) ?? product.items[0]
    )
  }, [product, skuId])
}
