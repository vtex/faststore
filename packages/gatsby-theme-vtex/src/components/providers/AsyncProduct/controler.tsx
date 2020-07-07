import { api } from '@vtex/gatsby-source-vtex'
import React, { createContext, FC, useContext } from 'react'
import { DataOrModifiedFn, useAsyncResource } from 'use-async-resource'

import { AsyncProduct, SyncProduct } from '../../../types/product'
import { useSalesChannel } from '../Binding'

export interface Props {
  syncProduct: SyncProduct
}

const fetcher = async (slug: string, sc: number) => {
  const url = api.search.bySlug(slug, {
    simulation: 'true',
    sc,
  })
  const response = await fetch(url)
  const [product]: AsyncProduct[] = await response.json()
  return product
}

const AsyncProductContext = createContext<DataOrModifiedFn<AsyncProduct>>(
  null as any
)

const AsyncProductProvider: FC<Props> = ({
  syncProduct: { linkText },
  children,
}) => {
  const [salesChannel] = useSalesChannel()
  const [asyncProductReader] = useAsyncResource(fetcher, linkText, salesChannel)

  return (
    <AsyncProductContext.Provider value={asyncProductReader}>
      {children}
    </AsyncProductContext.Provider>
  )
}

export const useAsyncProduct = () => {
  const asyncProductReader = useContext(AsyncProductContext)
  return asyncProductReader()
}

export default AsyncProductProvider
