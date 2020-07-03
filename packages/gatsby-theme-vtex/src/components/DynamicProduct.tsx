import { api } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import useSWR from 'swr'

import Product from './Product'
import { useSalesChannel } from './providers/Binding'
import { DynamicProduct as DynamicProductType, StaticProduct } from './Shapes'

interface Props {
  staticProduct: StaticProduct
}

const DynamicProduct: FC<Props> = ({ staticProduct }) => {
  const [salesChannel] = useSalesChannel()

  // Dynamic Properties
  const { data: dynamicData } = useSWR<DynamicProductType[]>(
    api.search.bySlug(staticProduct.linkText, {
      sc: salesChannel,
      simulation: 'true',
    }),
    (url: string) => fetch(url).then((r) => r.json()),
    { suspense: false }
  )
  const [dynamicProduct] = dynamicData ?? []

  return (
    <Product staticProduct={staticProduct} dynamicProduct={dynamicProduct} />
  )
}

export default DynamicProduct
