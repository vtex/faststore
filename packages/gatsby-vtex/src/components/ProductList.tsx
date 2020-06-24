import { Product } from '@vtex/gatsby-source-vtex'
import { Link } from 'gatsby'
import React, { FC } from 'react'
import { Box, Grid, Heading, Styled } from 'theme-ui'

import { scaleImage } from '../utils/img'

interface Props {
  data: Product[]
}

export const ProductList: FC<Props> = ({ data }) => {
  return (
    <Grid mt={4} gap={3} columns={[2, null, 4]}>
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
              src={scaleImage(product.items[0].images[0].imageUrl, 'auto', 300)}
            />
            <Heading variant="shellProductName" as="h3">
              {product.productName}
            </Heading>
          </Box>
        </Link>
      ))}
    </Grid>
  )
}
