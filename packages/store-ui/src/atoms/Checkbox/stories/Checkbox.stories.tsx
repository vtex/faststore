import type { Story, Meta, ArgTypes } from '@storybook/react'
import React from 'react'

import type { Props as CheckboxProps } from '../Checkbox'
import Component from '../Checkbox'
import mdx from './Checkbox.mdx'

const CheckboxTemplate: Story<CheckboxProps> = (props) => (
  <Component {...props} />
)

export const Checkbox = CheckboxTemplate.bind({})

const controls: ArgTypes = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
}

const actions: ArgTypes = {
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
