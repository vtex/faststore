import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { ButtonProps } from './Button'
import Root from './Button'
import type { UIButtonProps } from './UIButton'
import UI from './UIButton'

export default {
  title: 'Atoms/Button',
} as Meta

const ButtonTemplate: Story<ButtonProps> = (args) => <Root {...args} />
const UIButtonTemplate: Story<UIButtonProps> = (args) => <UI {...args} />

export const Button = ButtonTemplate.bind({})
Button.args = {
  children: 'Button',
}

export const UIButton = UIButtonTemplate.bind({})
UIButton.args = {
  children: 'UIButton',
  variant: 'sui-button',
}
