import React, { FC, useState, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { Flex, Styled, Box, Button, Heading } from 'theme-ui'

import Layout from './layout'
import SEO from './seo'

const fetchData = async (pathname: string) => {
  try {
    const data = await fetch(
      `https://${process.env.GATSBY_VTEX_ACCOUNT_NAME}.${process.env.GATSBY_VTEX_ENVIRONMENT}.com.br/api/catalog_system/pub/products/search${pathname}`
    )
    // eslint-disable-next-line no-console
    console.log('data', data.json())
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

interface Props extends RouteComponentProps {
  productSlug?: string
}

const Product: FC<Props> = ({ productSlug, location, ...props }: any) => {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState({})
  useEffect(() => {
    fetchData(location.pathname)
  }, [location.pathname, productSlug])

  const product = {
    productName: 'test',
    items: [{ images: [{ imageUrl: '' }] }],
  }

  // console.log("data", data)
  // console.log("isLoading", isLoading)

  return (
    <Layout>
      <SEO title={product.productName} />
      <Flex sx={{ flexWrap: 'wrap' }} mt={4}>
        <Box sx={{ maxWidth: '500px' }} mr={[0, 0, 4]} mb={[4, 0, 0]}>
          <Styled.img src={product.items[0].images[0].imageUrl} />
        </Box>
        <Flex sx={{ flexDirection: 'column' }}>
          <Heading variant="productTitle" as="h1">
            {product.productName}
          </Heading>
          <Button variant="productBuy">Add to Cart</Button>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Product
