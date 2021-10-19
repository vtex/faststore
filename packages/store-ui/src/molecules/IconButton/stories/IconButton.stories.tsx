import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { Props as IconButtonProps } from '../IconButton'
import Component from '../IconButton'
import ShoppingCartIcon from '../../../atoms/Icon/stories/assets/ShoppingCart'
import mdx from './IconButton.mdx'

const IconButtonTemplate: Story<IconButtonProps> = (otherProps) => (
  <Component {...otherProps} icon={<ShoppingCartIcon />} />
)

export const Default = IconButtonTemplate.bind({})

const IconButtonCustomTemplate: Story<IconButtonProps> = (otherProps) => {
  return (
    <Component
      {...otherProps}
      className="iconButton"
      icon={<ShoppingCartIcon />}
    />
  )
}

export const CustomStyle = IconButtonCustomTemplate.bind({})

export default {
  title: 'Molecules/IconButton',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
