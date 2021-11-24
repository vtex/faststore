import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { BannerProps } from '../Banner'
import Component from '../Banner'
import mdx from './Banner.mdx'

const BannerTemplate: Story<BannerProps> = ({ testId }) => (
  <Component testId={testId}>Banner</Component>
)

export const Banner = BannerTemplate.bind({})
Banner.storyName = 'Banner'

export default {
  title: 'Molecules/Banner',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
