/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

import { ProductSummary } from './ProductSummary'
import { SyncProductItem } from '../types/product'

interface Props {
  syncProducts: SyncProductItem[]
}

export const ProductList: FC<Props> = ({ syncProducts }) => {
  return (
    <Fragment>
      {syncProducts.map((syncProduct, index) => (
        <ProductSummary
          key={syncProduct.id}
          syncProduct={syncProduct}
          lazyLoad={index > 3}
        />
      ))}
    </Fragment>
  )
}
