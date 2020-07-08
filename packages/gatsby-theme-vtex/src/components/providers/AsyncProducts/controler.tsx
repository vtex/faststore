import { api, FilterOptions } from '@vtex/gatsby-source-vtex'
import React, { createContext, FC, useContext } from 'react'
import useSWR from 'swr'

import {
  AsyncProduct,
  AsyncProductItem,
  SyncProductItem,
} from '../../../types/product'
import { jsonFetcher } from '../../../utils/fetcher'
import { useSalesChannel } from '../Binding/controler'

export interface Props {
  syncProducts: SyncProductItem[]
  filterOptions: FilterOptions
}

const AsyncProductsContext = createContext<AsyncProduct[] | null>(null)

const AsyncProductsProvider: FC<Props> = ({ filterOptions, children }) => {
  const [salesChannel] = useSalesChannel()
  const swr = useSWR<AsyncProductItem[]>(
    api.search(filterOptions, {
      sc: salesChannel,
      simulation: 'true',
    }),
    {
      fetcher: jsonFetcher,
      suspense: false,
    }
  )

  return (
    <AsyncProductsContext.Provider value={swr.data ?? null}>
      {children}
    </AsyncProductsContext.Provider>
  )
}

export const useAsyncProduct = (index: number) => {
  const products = useContext(AsyncProductsContext)

  if (!products) {
    return null
  }

  return products[index]
}

export default AsyncProductsProvider
