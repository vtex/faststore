import type { Story } from '@storybook/react'
import React from 'react'

import { Badge as Component, BadgeProps } from '@faststore/components'
import type { ComponentArgTypes } from '../../../../typings/utils'
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
