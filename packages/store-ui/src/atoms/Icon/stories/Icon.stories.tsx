import React from 'react'
import type { Story } from '@storybook/react'

import Component from '../Icon'
import type { IconProps } from '../Icon'
import mdx from './Icon.mdx'
import ShoppingCart from './assets/ShoppingCart'
import type { ComponentArgTypes } from '../../../typings/utils'

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
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
