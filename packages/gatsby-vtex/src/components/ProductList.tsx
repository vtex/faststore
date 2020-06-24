import { Product } from '@vtex/gatsby-source-vtex'
import { Link } from 'gatsby'
import React, { FC } from 'react'
import { Box, Heading, Styled } from 'theme-ui'

import { scaleImage, IMAGE_DEFAULT } from '../utils/img'

interface Props {
  data: Product[]
}

export const ProductList: FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((product) => (
        <Link
          key={product.id}
          to={product.slug}
          sx={{
            textDecoration: 'none',
            color: 'text',
          }}
        >
          <Box>
            <Styled.img
              height="300px"
              src={
                product.items.length && product.items[0].images
                  ? scaleImage(product.items[0].images[0].imageUrl, 'auto', 300)
                  : IMAGE_DEFAULT
              }
            />
            <Heading variant="shellProductName" as="h3">
              {product.productName}
            </Heading>
          </Box>
        </Link>
      ))}
    </>
  )
}
