import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import Component from '../Badge'
import mdx from './Badge.mdx'

interface StoryControls {
  badgeText: string
}

const BadgeTemplate: Story<StoryControls> = ({ badgeText }) => (
  <Component>{badgeText}</Component>
)

export const Badge = BadgeTemplate.bind({})

const argTypes: ComponentArgTypes<StoryControls> = {
  badgeText: {
    name: 'Badge text',
    control: {
      type: 'text',
    },
    defaultValue: '-25%',
  },
}

export default {
  title: 'Atoms/Badge',
  component: Badge,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
