import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { IconProps } from './Icon'
import Root from './Icon'

export default {
  title: 'Atoms/Icon',
} as Meta

const IconTemplate: Story<IconProps> = (args) => <Root {...args} />

// icon by feathericons
const ShoppingCart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

export const Icon = IconTemplate.bind({})
Icon.args = {
  style: {
    fontSize: '32px',
    color: 'red',
  },
  component: <ShoppingCart />,
}
