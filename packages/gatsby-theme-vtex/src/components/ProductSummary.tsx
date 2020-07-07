/** @jsx jsx */
import { FC } from 'react'
import { Card, Heading, jsx } from 'theme-ui'

import { Offer } from './Offer'
import ProductImage from './ProductImage'
import { BuyButton } from './BuyButton'
import { SyncProductItem } from '../types/product'

interface Props {
  syncProduct: SyncProductItem
  lazyLoad: boolean
  index: number
}

export const ProductSummary: FC<Props> = ({
  syncProduct,
  lazyLoad = true,
  index,
}) => (
  <Card
    sx={{
      m: 'auto',
      maxWidth: 300,
      textAlign: 'center',
    }}
  >
    <ProductImage
      width={300}
      height={300}
      product={syncProduct}
      lazyLoad={lazyLoad} // lazy load after the third image
    />
    <Heading variant="shellProductName" as="h3">
      {syncProduct.productName.slice(0, 12)}
    </Heading>
    <Offer />
    <BuyButton skuId={syncProduct.items[0].itemId} />
  </Card>
)
