/** @jsx jsx */
import { Product } from '@vtex/gatsby-source-vtex'
import { FC, Fragment, useEffect } from 'react'
import { Card, Grid, Heading, jsx } from 'theme-ui'

import ProductImage from './ProductImage'
import { DynamicProduct, StaticProduct } from './Shapes'
import { useCurrency } from './providers/Binding'
import SEO from './Seo'
import { Offer } from './Offer'
import { BuyButton } from './BuyButton'

interface Props {
  staticProduct: StaticProduct
  dynamicProduct: DynamicProduct
}

// Code-splits structured data injection
// because it's not critical for rendering the page.
const injectStructuredDataLazily = async (
  product: Product,
  currency: string
) => {
  const {
    default: { injectProduct },
  } = await import('./structuredData')
  injectProduct(product, currency)
}

const ProductTemplate: FC<Props> = ({ dynamicProduct, staticProduct }) => {
  const [currency] = useCurrency()
  const { productName } = staticProduct

  // Inject StructuredData after rendering so we don't block the
  // rendering process and harm performance
  useEffect(() => {
    if (dynamicProduct) {
      injectStructuredDataLazily(dynamicProduct, currency)
    }
  }, [currency, dynamicProduct])

  return (
    <Fragment>
      <SEO title={productName} />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <ProductImage
          width={500}
          height={500}
          product={staticProduct}
          lazyLoad={false} // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <Offer product={dynamicProduct} />
          <BuyButton item={dynamicProduct?.items[0]} />
        </Card>
      </Grid>
    </Fragment>
  )
}

export default ProductTemplate
