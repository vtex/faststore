import type { Story } from '@storybook/react'
import React from 'react'

import type { InputProps } from '../Input'
import Component from '../Input'
import mdx from './Input.mdx'

const InputTemplate: Story<InputProps> = ({ placeholder, state }) => {
  const colorByState = {
    default: 'black',
    success: 'green',
    error: 'red',
  }

  return (
    <Component
      style={{
        borderColor: colorByState[state || 'default'],
        borderStyle: 'solid',
      }}
      placeholder={placeholder}
      state={state}
    />
  )
}

export const Input = InputTemplate.bind({})

export default {
  title: 'Atoms/Input',
  component: Input,
  argTypes: {
    state: {
      options: ['default', 'success', 'error'],
      defaultValue: 'default',
      control: { type: 'select' },
    },
    placeholder: {
      control: { type: 'text' },
      defaultValue: 'Input',
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
