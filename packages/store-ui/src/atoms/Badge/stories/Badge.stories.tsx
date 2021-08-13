import type { Story } from '@storybook/react'
import React from 'react'

import Component from '../Badge'
import mdx from './Badge.mdx'

interface StoryControls {
  badgeText: string
}

const BadgeTemplate: Story<StoryControls> = ({ badgeText }) => (
  <Component>{badgeText}</Component>
)

export const Badge = BadgeTemplate.bind({})

export default {
  title: 'Atoms/Badge',
  component: Badge,
  argTypes: {
    badgeText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Discount badge',
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
