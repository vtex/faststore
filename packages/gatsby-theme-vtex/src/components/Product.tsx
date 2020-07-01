/** @jsx jsx */
import { Product } from '@vtex/gatsby-source-vtex'
import { FC, Fragment, useEffect } from 'react'
import { Button, Grid, Heading, jsx, Card } from 'theme-ui'

import ProductImage from './ProductImage'
import SEO from './Seo'
import { injectProductStructuredData } from './structuredData/product'

interface Props {
  data: {
    product: Product
  }
}

const ProductTemplate: FC<Props> = ({ data }) => {
  const { product } = data
  const { productName } = product

  // Inject StructuredData after rendering so we don't block the
  // rendering process and harm performance
  useEffect(() => injectProductStructuredData(product), [product])

  return (
    <Fragment>
      <SEO title={productName} />
      <Grid my={4} gap={3} columns={[1, 2]}>
        <ProductImage
          width={500}
          height={500}
          product={product}
          lazyLoad={false} // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <Button variant="productBuy">Add to Cart</Button>
        </Card>
      </Grid>
    </Fragment>
  )
}

export default ProductTemplate
