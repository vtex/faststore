/** @jsx jsx */
import loadable from '@loadable/component'
import { Product } from '@vtex/gatsby-source-vtex'
import { FC, Fragment, useEffect } from 'react'
import { Button, Card, Grid, Heading, jsx } from 'theme-ui'

import ProductImage from './ProductImage'
import SEO from './Seo'

// Code-splits structured data injection
// because it's not critical for rendering the page.
const structuredData = loadable.lib(() => import('./structuredData'))

interface Props {
  data: {
    product: Product
  }
}

const injectStructuredDataLazily = async (product: Product) => {
  const {
    default: { injectProduct },
  } = (await structuredData.load()) as any
  injectProduct(product)
}

const ProductTemplate: FC<Props> = ({ data }) => {
  const { product } = data
  const { productName } = product

  // Inject StructuredData after rendering so we don't block the
  // rendering process and harm performance
  useEffect(() => {
    injectStructuredDataLazily(product)
  }, [product])

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
