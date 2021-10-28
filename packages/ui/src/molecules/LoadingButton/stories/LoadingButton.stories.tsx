import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { LoadingButtonProps } from '../LoadingButton'
import Component from '../LoadingButton'
import mdx from './LoadingButton.mdx'

const LoadingButtonTemplate: Story<LoadingButtonProps> = ({
  loading,
  testId,
}) => (
  <Component loading={loading} testId={testId}>
    Loading Button
  </Component>
)

export const LoadingButton = LoadingButtonTemplate.bind({})

const argTypes: ComponentArgTypes<LoadingButtonProps> = {
  loading: {
    type: 'boolean',
    defaultValue: false,
  },
}

export default {
  title: 'Molecules/LoadingButton',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
