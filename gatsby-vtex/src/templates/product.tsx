import React from "react"
import { graphql } from "gatsby"
import { Flex, Styled, Box, Button, Heading } from "theme-ui"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default function Product({ location, data: { product } }) {
  return (
    <Layout>
      <SEO title={product.productName} />
      <Flex sx={{ flexWrap: "wrap" }} mt={4}>
        <Box sx={{ maxWidth: "500px" }} mr={[0, 0, 4]} mb={[4, 0, 0]}>
          <Styled.img src={product.items[0].images[0].imageUrl} />
        </Box>
        <Flex sx={{ flexDirection: "column" }}>
          <Heading variant="productTitle" as="h1">
            {product.productName}
          </Heading>
          <Button variant="productBuy">Add to Cart</Button>
        </Flex>
      </Flex>
    </Layout>
  )
}

export const query = graphql`
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
