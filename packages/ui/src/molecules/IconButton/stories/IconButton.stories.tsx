import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { Props as IconButtonProps } from '../IconButton'
import Component from '../IconButton'
import ShoppingCartIcon from '../../../atoms/Icon/stories/assets/ShoppingCart'
import mdx from './IconButton.mdx'

const IconButtonTemplate: Story<IconButtonProps> = (props) => (
  <Component {...props} icon={<ShoppingCartIcon />} label="Buy" />
)

export const Default = IconButtonTemplate.bind({})

const IconButtonCustomTemplate: Story<IconButtonProps> = (props) => {
  return (
    <Component
      {...props}
      className="iconButton"
      icon={<ShoppingCartIcon />}
      label="Buy"
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
