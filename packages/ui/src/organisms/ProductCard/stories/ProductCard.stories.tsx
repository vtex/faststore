import type { Story, Meta } from '@storybook/react'
import React from 'react'

// Atoms
import Price from '../../../atoms/Price'
import Badge from '../../../atoms/Badge'
// Product Card components
import ProductCardComponent from '../ProductCard'
import ProductCardImage from '../ProductCardImage'
import ProductCardInfo from '../ProductCardInfo'
import ProductCardTitle from '../ProductCardTitle'
import ProductCardPrice from '../ProductCardPrice'
import ProductCardTags from '../ProductCardTags'
import ProductCardLink from '../ProductCardLink'
import type { ProductCardProps } from '../ProductCard'
import mdx from './ProductCard.mdx'

const ProductCardTemplate: Story<ProductCardProps> = ({ testId }) => (
  <ProductCardComponent testId={testId}>
    <ProductCardImage>
      <img
        alt="A vintage camera"
        src="https://storecomponents.vtex.app/assets/fit-in/480x480/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Farquivos%2Fids%2F155481%2FFrame-3.jpg%3Fv%3D636793814536230000"
      />
    </ProductCardImage>
    <ProductCardInfo>
      <ProductCardTitle>
        <h3>Vintage Top Camera</h3>
      </ProductCardTitle>
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
    <ProductCardLink>
      <a href="/">Add to cart</a>
    </ProductCardLink>
  </ProductCardComponent>
)

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
