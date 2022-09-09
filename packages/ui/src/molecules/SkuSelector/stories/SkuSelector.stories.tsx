import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { SkuSelectorProps } from '../SkuSelector'
import Component from '../SkuSelector'
import mdx from './SkuSelector.mdx'

const SkuSelectorTemplate: Story<SkuSelectorProps> = ({ testId }) => (
  <Component testId={testId} variant={'label'} options={[]} activeValue={''}>SkuSelector</Component>
)

export const SkuSelector = SkuSelectorTemplate.bind({})
SkuSelector.storyName = 'SkuSelector'

export default {
  title: 'Molecules/SkuSelector',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
