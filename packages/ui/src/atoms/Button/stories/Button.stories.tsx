import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { ButtonProps } from '../Button'
import Component from '../Button'
import mdx from './Button.mdx'

const ButtonTemplate: Story<ButtonProps> = ({ children, onClick, testId }) => (
  <Component onClick={onClick} testId={testId}>
    {children}
  </Component>
)

export const Button = ButtonTemplate.bind({})

const argTypes: ComponentArgTypes<ButtonProps> = {
  children: {
    control: { type: 'text' },
    defaultValue: 'Button',
  },
  onClick: {
    action: 'Button clicked',
    table: { disable: true },
  },
}

export default {
  title: 'Atoms/Button',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
