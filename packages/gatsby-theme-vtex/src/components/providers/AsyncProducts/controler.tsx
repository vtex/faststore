import { api, FilterOptions, SearchOptions } from '@vtex/gatsby-source-vtex'
import React, { createContext, FC, useContext } from 'react'
import { DataOrModifiedFn, useAsyncResource } from 'use-async-resource'

import {
  AsyncProduct,
  AsyncProductItem,
  SyncProductItem,
} from '../../../types/product'
import { useSalesChannel } from '../Binding'

export interface Props {
  syncProducts: SyncProductItem[]
  filterOptions: FilterOptions
}

const fetcher = async (
  filterOptions: FilterOptions,
  searchOptions: SearchOptions
) => {
  const url = api.search.byFilters(filterOptions, searchOptions)
  const response = await fetch(url)
  const products: AsyncProductItem[] = await response.json()
  return products
}

const AsyncProductsContext = createContext<DataOrModifiedFn<AsyncProduct[]>>(
  null as any
)

const AsyncProductsProvider: FC<Props> = ({ filterOptions, children }) => {
  const [salesChannel] = useSalesChannel()
  // const productIds = useMemo(() => syncProducts.map((x) => x.productId), [
  //   syncProducts,
  // ])
  const [asyncProductReader] = useAsyncResource(fetcher, filterOptions, {
    sc: salesChannel,
    simulation: 'true',
  })

  return (
    <AsyncProductsContext.Provider value={asyncProductReader}>
      {children}
    </AsyncProductsContext.Provider>
  )
}

export const useAsyncProducts = () => {
  const asyncProductReader = useContext(AsyncProductsContext)
  return asyncProductReader()
}

export default AsyncProductsProvider
