import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { InputProps } from '../Input'
import Component from '../Input'
import mdx from './Input.mdx'

const InputTemplate: Story<InputProps> = ({ placeholder, variant }) => (
  <Component placeholder={placeholder} variant={variant} />
)

export const Input = InputTemplate.bind({})

const argTypes: ComponentArgTypes<InputProps> = {
  variant: {
    options: ['default', 'success', 'error'],
    defaultValue: 'default',
    control: { type: 'select' },
  },
  placeholder: {
    control: { type: 'text' },
    defaultValue: 'Input',
  },
}

export default {
  title: 'Atoms/Input',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
