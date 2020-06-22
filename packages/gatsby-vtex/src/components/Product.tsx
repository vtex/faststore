import React, { FC, Fragment } from 'react'
import { Box, Button, Flex, Heading, Styled } from 'theme-ui'

import SEO from './Seo'

interface Props {
  data?: any
}

const ProductTemplate: FC<Props> = ({ data }) => {
  const {
    product: { productName, items },
  } = data

  return (
    <Fragment>
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
    </Fragment>
  )
}

export default ProductTemplate
