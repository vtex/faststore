import type { Story, Meta } from '@storybook/react'
import React from 'react'

// Atoms
import Price from '../../../atoms/Price'
import Badge from '../../../atoms/Badge'
import Button from '../../../atoms/Button'
// Product Card components
import ProductCardComponent from '../ProductCard'
import ProductCardImage from '../ProductCardImage'
import ProductCardInfo from '../ProductCardInfo'
import ProductCardHeader from '../ProductCardHeader'
import ProductCardPrice from '../ProductCardPrice'
import ProductCardTags from '../ProductCardTags'
import ProductCardLink from '../ProductCardLink'
import type { ProductCardProps } from '../ProductCard'
import mdx from './ProductCard.mdx'

const ProductCardTemplate: Story<ProductCardProps> = ({ testId }) => {
  return (
    <ProductCardComponent testId={testId}>
      <ProductCardLink href="/">
        <ProductCardImage>
          <img
            alt="A vintage camera"
            src="https://storecomponents.vtex.app/assets/fit-in/480x480/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Farquivos%2Fids%2F155481%2FFrame-3.jpg%3Fv%3D636793814536230000"
          />
        </ProductCardImage>
        <ProductCardInfo>
          <ProductCardHeader>
            <h3>Vintage Top Camera</h3>
          </ProductCardHeader>
          <ProductCardPrice>
            <Price
              value={89.9}
              variant="selling"
              formatter={formatter}
              style={{ textDecoration: 'line-through' }}
            />
            <Price value={68.9} variant="selling" formatter={formatter} />
          </ProductCardPrice>
          <ProductCardTags>
            <Badge>15% OFF</Badge>
          </ProductCardTags>
        </ProductCardInfo>
      </ProductCardLink>
      <Button onClick={() => null}>Add to Cart</Button>
    </ProductCardComponent>
  )
}

function formatter(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const ProductCard = ProductCardTemplate.bind({})
ProductCard.storyName = 'ProductCard'

export default {
  title: 'Organisms/ProductCard',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
