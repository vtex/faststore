import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { InputProps } from './Input'
import Root from './Input'

export default {
  title: 'Atoms/Input',
} as Meta

const InputTemplate: Story<InputProps> = (args) => <Root {...args} />

export const Default = InputTemplate.bind({})
Default.args = {
  placeholder: 'First name',
}

export const Error = InputTemplate.bind({})
Error.args = {
  placeholder: 'First name',
  state: 'error',
}

export const Success = InputTemplate.bind({})
Success.args = {
  placeholder: 'First name',
  state: 'success',
}
