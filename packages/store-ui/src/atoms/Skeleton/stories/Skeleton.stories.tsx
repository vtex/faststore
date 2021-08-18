import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { SkeletonProps } from '../Skeleton'
import Component from '../Skeleton'
import mdx from './Skeleton.mdx'

const SkeletonTemplate: Story<SkeletonProps> = ({
  width,
  height,
  backgroundColor,
  highlightColor,
  testId,
}) => (
  <Component
    width={width}
    height={height}
    backgroundColor={backgroundColor}
    highlightColor={highlightColor}
    testId={testId}
  />
)

export const Skeleton = SkeletonTemplate.bind({})

const argTypes: ComponentArgTypes<SkeletonProps> = {
  width: {
    control: { type: 'text' },
    defaultValue: '100%',
  },
  height: {
    control: { type: 'text' },
    defaultValue: '50px',
  },
  backgroundColor: {
    control: { type: 'text' },
    defaultValue: '#eee',
  },
  highlightColor: {
    control: { type: 'text' },
    defaultValue: '#ddd',
  },
}

export default {
  title: 'Atoms/Skeleton',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
