/** @jsx jsx */
import { Product } from '@vtex/gatsby-source-vtex'
import { Link } from 'gatsby'
import { FC, Fragment } from 'react'
import { Heading, jsx, Card } from 'theme-ui'

import ProductImage from './ProductImage'

interface Props {
  data: Product[]
}

export const ProductList: FC<Props> = ({ data }) => {
  return (
    <Fragment>
      {data.map((product, index) => (
        <Link
          key={product.id}
          to={product.slug}
          sx={{
            textDecoration: 'none',
            color: 'text',
          }}
        >
          <Card
            sx={{
              m: 'auto',
              maxWidth: 300,
              textAlign: 'center',
            }}
          >
            <ProductImage
              width={300}
              height={300}
              product={product}
              lazyLoad={index > 3} // lazy load after the third image
            />
            <Heading variant="shellProductName" as="h3">
              {product.productName}
            </Heading>
          </Card>
        </Link>
      ))}
    </Fragment>
  )
}
