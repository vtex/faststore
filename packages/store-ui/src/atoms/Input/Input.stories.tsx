import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { InputProps } from './Input'
import Root from './Input'

export default {
  title: 'Atoms/Input',
} as Meta

const InputTemplate: Story<InputProps> = (args) => <Root {...args} />

export const Input = InputTemplate.bind({})
Input.args = {
  placeholder: 'First name',
  error: false,
  success: false,
}
