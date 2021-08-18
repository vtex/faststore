import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { CheckboxProps } from '../Checkbox'
import Component from '../Checkbox'
import mdx from './Checkbox.mdx'

const CheckboxTemplate: Story<CheckboxProps> = (props) => (
  <Component {...props} />
)

export const Checkbox = CheckboxTemplate.bind({})

const controls: ComponentArgTypes<CheckboxProps> = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
}

const actions: ComponentArgTypes<CheckboxProps> = {
  onClick: { action: 'clicked', table: { disable: true } },
}

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    ...controls,
    ...actions,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
