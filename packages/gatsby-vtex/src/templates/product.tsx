import { graphql } from 'gatsby'
import React, { useEffect, useState, FC } from 'react'
import { Box, Button, Flex, Heading, Styled } from 'theme-ui'
import { RouteComponentProps } from '@reach/router'

import Layout from '../components/layout'
import SEO from '../components/seo'

const staticQueryOnClient = async (slug: string) => {
  const data = await fetch(
    `http://${process.env.GATSBY_VTEX_TENANT}.${process.env.GATSBY_VTEX_ENVIRONMENT}.com.br/api/catalog_system/pub/products/search/${slug}/p`,
    {
      method: 'GET',
      credentials: 'same-origin',
    }
  )
  const [product] = await data.json()
  return {
    product,
  }
}

export const staticQuery = graphql`
  query($id: String!) {
    product(id: { eq: $id }) {
      productName
      items {
        images {
          imageUrl
        }
      }
    }
  }
`

interface Props extends RouteComponentProps {
  data?: any
  slug?: string
}

const Product: FC<Props> = ({ slug, data: staticData }) => {
  const [data, setData] = useState(maybeData)

  useEffect(() => {
    if (maybeData == null) {
      staticQueryOnClient(slug).then(setData)
    }
  }, [maybeData, slug])

  if (!data) {
    return <div>loading!...</div>
  }

  const {
    product: { productName, items },
  } = data

  return (
    <Layout>
      <SEO title={productName} />
      <Flex sx={{ flexWrap: 'wrap' }} mt={4}>
        <Box sx={{ maxWidth: '500px' }} mr={[0, 0, 4]} mb={[4, 0, 0]}>
          <Styled.img src={items[0].images[0].imageUrl} />
        </Box>
        <Flex sx={{ flexDirection: 'column' }}>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <Button variant="productBuy">Add to Cart</Button>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Product
