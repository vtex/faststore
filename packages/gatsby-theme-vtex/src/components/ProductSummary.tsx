/** @jsx jsx */
import { FC } from 'react'
import { Card, Heading, jsx } from 'theme-ui'

import { Offer } from './Offer'
import ProductImage from './ProductImage'
import { DynamicProduct, StaticProduct } from './Shapes'
import { BuyButton } from './BuyButton'

interface Props {
  staticProduct: StaticProduct
  dynamicProduct?: DynamicProduct
  lazyLoad: boolean
}

export const ProductSummary: FC<Props> = ({
  staticProduct,
  dynamicProduct,
  lazyLoad = true,
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
      product={staticProduct}
      lazyLoad={lazyLoad} // lazy load after the third image
    />
    <Heading variant="shellProductName" as="h3">
      {staticProduct.productName.slice(0, 12)}
    </Heading>
    <Offer product={dynamicProduct} />
    <BuyButton item={dynamicProduct?.items[0]} />
  </Card>
)
