import type { Story } from '@storybook/react'
import React from 'react'

import type { SpinnerProps } from '../Spinner'
import Component from '../Spinner'
import mdx from './Spinner.mdx'

const SpinnerTemplate: Story<SpinnerProps> = ({ testId }) => (
  <Component testId={testId} />
)

export const Spinner = SpinnerTemplate.bind({})

export default {
  title: 'Atoms/Spinner',
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
