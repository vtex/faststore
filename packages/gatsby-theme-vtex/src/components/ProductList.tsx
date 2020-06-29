import { Product } from '@vtex/gatsby-source-vtex'
import { Link } from 'gatsby'
import React, { FC } from 'react'
import { Box, Heading } from 'theme-ui'

import ProductImage from './ProductImage'

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
            <ProductImage height={300} product={product} />
            <Heading variant="shellProductName" as="h3">
              {product.productName}
            </Heading>
          </Box>
        </Link>
      ))}
    </>
  )
}
