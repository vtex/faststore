import type { Story } from '@storybook/react'
import React from 'react'

import type { Props as CheckboxProps } from '../Checkbox'
import Component from '../Checkbox'
import mdx from './Checkbox.mdx'

const CheckboxTemplate: Story<CheckboxProps> = ({ testId }) => (
  <Component testId={testId} />
)

export const Checkbox = CheckboxTemplate.bind({})

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
