import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { ProductCardProps } from '../ProductCard'
import Component from '../ProductCard'
import mdx from './ProductCard.mdx'

const ProductCardTemplate: Story<ProductCardProps> = ({ testId }) => (
  <Component testId={testId}>ProductCard</Component>
)

export const ProductCard = ProductCardTemplate.bind({})
ProductCard.storyName = 'ProductCard'

export default {
  title: 'Molecules/ProductCard',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
