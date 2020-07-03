import { api, FilterOptions } from '@vtex/gatsby-source-vtex'
import React, { FC, useMemo } from 'react'
import useSWR from 'swr'

import { ProductList } from './ProductList'
import { useSalesChannel } from './providers/Binding'
import { DynamicProduct, StaticProduct } from './Shapes'

interface Props {
  staticProducts: StaticProduct[]
  filterOptions?: FilterOptions
}

const EMPTY_LIST: DynamicProduct[] = []

const DynamicProductList: FC<Props> = ({ staticProducts, filterOptions }) => {
  const [salesChannel] = useSalesChannel()
  const productIds = useMemo(() => staticProducts.map((x) => x.productId), [
    staticProducts,
  ])

  // Dynamic Properties
  const { data: dynamicProducts } = useSWR<DynamicProduct[]>(
    api.search.byFilters(
      { productIds, ...filterOptions },
      {
        sc: salesChannel,
        simulation: 'true',
      }
    ),
    (url: string) => fetch(url).then((r) => r.json()),
    { suspense: false }
  )

  return (
    <ProductList
      staticProducts={staticProducts}
      dynamicProducts={dynamicProducts ?? EMPTY_LIST}
    />
  )
}

export default DynamicProductList
