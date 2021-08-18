import type { Story } from '@storybook/react'
import React from 'react'
import type { ComponentArgTypes } from 'typings/utils'

import type { IconProps } from '../Icon'
import Component from '../Icon'
import ShoppingCart from './assets/ShoppingCart'
import mdx from './Icon.mdx'

const IconTemplate: Story<IconProps> = ({ style }) => (
  <Component style={style} component={<ShoppingCart />} />
)

export const Icon = IconTemplate.bind({})
Icon.args = {
  style: {
    fontSize: '32px',
    color: 'red',
  },
}

const argTypes: ComponentArgTypes<Omit<IconProps, 'component'>> = {
  style: {
    control: { type: 'object' },
  },
  onClick: {
    action: 'Icon clicked',
    table: { disable: true },
  },
}

export default {
  title: 'Atoms/Icon',
  component: Icon,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
