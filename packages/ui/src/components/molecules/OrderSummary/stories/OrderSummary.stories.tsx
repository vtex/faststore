import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { OrderSummaryProps } from '../OrderSummary'
import Component from '../OrderSummary'
import mdx from './OrderSummary.mdx'

const OrderSummaryTemplate: Story<OrderSummaryProps> = () => (
  <Component 
    subtotalLabel='Subtotal (3 products)'
    subtotalValue='$300'
    discountLabel='Discount'
    discountValue='-$50'
    totalLabel='Total'
    totalValue='250$'
  />
)

export const OrderSummary = OrderSummaryTemplate.bind({})
OrderSummary.storyName = 'OrderSummary'

export default {
  title: 'Molecules/OrderSummary',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
