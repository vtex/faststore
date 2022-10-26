import type { Story, Meta } from '@storybook/react'
import React from 'react'

import { SafetyIcon } from './assets/Icons'
import type { IncentiveProps } from '../Incentive'
import Component from '../Incentive'
import mdx from './Incentive.mdx'

const IncentiveTemplate: Story<IncentiveProps> = ({ testId }) => (
  <Component testId={testId}>
    <SafetyIcon />
    <span>Trusted by SafeCompany</span>
  </Component>
)

export const Incentive = IncentiveTemplate.bind({})
Incentive.storyName = 'Incentive'

export default {
  title: 'Atoms/Incentive',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
