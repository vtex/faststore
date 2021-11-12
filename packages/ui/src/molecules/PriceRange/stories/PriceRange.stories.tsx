import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { PriceRangeProps } from '../PriceRange'
import Component from '../PriceRange'
import mdx from './PriceRange.mdx'

const PriceRangeTemplate: Story<PriceRangeProps> = (props) => (
  <Component {...props} />
)

export const PriceRange = PriceRangeTemplate.bind({})
PriceRange.storyName = 'PriceRange'

function formatter(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const argTypes: ComponentArgTypes<PriceRangeProps> = {
  min: {
    control: { type: 'number', min: 0 },
    defaultValue: 0,
  },
  max: {
    control: { type: 'number', min: 1 },
    defaultValue: 500,
  },
  formatter: {
    defaultValue: formatter,
  },
}

export default {
  title: 'Molecules/PriceRange',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
