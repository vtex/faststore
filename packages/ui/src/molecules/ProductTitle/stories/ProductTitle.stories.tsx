import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { ProductTitleProps } from '../ProductTitle'
import Component from '../ProductTitle'
import mdx from './ProductTitle.mdx'
import Badge from '../../../atoms/Badge'

const ProductTitleTemplate: Story<ProductTitleProps> = () => (
  <Component 
    title={<h1>Apple Magic Mouse</h1>}
    refNumber='99995945'
    label={<Badge>90%</Badge>}
  />
)

export const ProductTitle = ProductTitleTemplate.bind({})
ProductTitle.storyName = 'ProductTitle'

export default {
  title: 'Molecules/ProductTitle',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
