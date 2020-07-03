/** @jsx jsx */
import loadable from '@loadable/component'
import { api, Product } from '@vtex/gatsby-source-vtex'
import { FC, Fragment, useEffect } from 'react'
import useSWR from 'swr'
import { Button, Card, Grid, Heading, jsx } from 'theme-ui'

import ProductImage from './ProductImage'
import { useCurrency, useSalesChannel } from './providers/Binding'
import SEO from './Seo'

// Price won't show up untill the requests is fulliled, so
// let's load it afterwards to not harm critical performance
const Offer = loadable(() => import('./Offer'), {
  ssr: false,
})

// Code-splits structured data injection
// because it's not critical for rendering the page.
const structuredData = loadable.lib(() => import('./structuredData'))

interface Props {
  data: {
    product: Product
  }
}

const injectStructuredDataLazily = async (
  product: Product,
  currency: string
) => {
  const {
    default: { injectProduct },
  } = (await structuredData.load()) as any
  injectProduct(product, currency)
}

const ProductTemplate: FC<Props> = ({ data }) => {
  // Static Properties
  const { product } = data
  const { productName } = product
  const [currency] = useCurrency()
  const [salesChannel] = useSalesChannel()

  // Dynamic Properties
  const { data: dynamicData } = useSWR<Product[]>(
    api.search.bySlug(product.linkText, { sc: salesChannel }),
    (url: string) => fetch(url).then((r) => r.json()),
    {
      suspense: false,
    }
  )
  const [dynamicProduct] = dynamicData ?? []

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
          product={product}
          lazyLoad={false} // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <Offer
            product={dynamicProduct}
            fallback={<div>Loading Price Component</div>}
          />
          <Button variant="productBuy" sx={{ width: '100%' }}>
            ADD TO CART
          </Button>
        </Card>
      </Grid>
    </Fragment>
  )
}

export default ProductTemplate
