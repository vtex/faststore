import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { HeroProps } from '../Hero'
import Component from '../Hero'
import mdx from './Hero.mdx'

const HeroTemplate: Story<HeroProps> = ({ testId }) => (
  <Component testId={testId}>Hero</Component>
)

export const Hero = HeroTemplate.bind({})
Hero.storyName = 'Hero'

export default {
  title: 'Organisms/Hero',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
