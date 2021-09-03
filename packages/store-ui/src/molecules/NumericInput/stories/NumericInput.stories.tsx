import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { NumericInputProps } from '../NumericInput'
import Component from '../NumericInput'
import mdx from './NumericInput.mdx'

const NumericInputTemplate: Story<NumericInputProps> = (props) => (
  <Component {...props} />
)

export const NumericInput = NumericInputTemplate.bind({})

const argTypes: ComponentArgTypes<NumericInputProps> = {
  value: {
    control: { type: 'number', min: 0 },
    defaultValue: 0,
    min: 0,
  },
  defaultValue: {
    control: { type: 'number', min: 0 },
    defaultValue: 0,
    min: 0,
  },
  min: {
    control: { type: 'number', min: 0 },
    defaultValue: 0,
  },
  max: {
    control: { type: 'number', min: 1 },
    defaultValue: 10,
  },
  isDisabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  onChange: {
    action: 'Input value changed',
    table: { disable: true },
  },
}

export default {
  title: 'Molecules/NumericInput',
  component: NumericInput,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
