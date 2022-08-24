import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { GiftProps } from '../Gift'
import Component from '../Gift'
import mdx from './Gift.mdx'

const GiftTemplate: Story<GiftProps> = ({ testId }) => (
  <Component testId={testId}>Gift</Component>
)

export const Gift = GiftTemplate.bind({})
Gift.storyName = 'Gift'

export default {
  title: 'Molecules/Gift',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
