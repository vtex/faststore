import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { ButtonProps } from './Button'
import Root from './Button'

export default {
  title: 'Atoms/Button',
} as Meta

const ButtonTemplate: Story<ButtonProps> = (args) => <Root {...args} />

export const Button = ButtonTemplate.bind({})
Button.args = {
  children: 'Button',
}
