import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { NumberInputProps } from '../NumberInput'
import Component from '../NumberInput'
import mdx from './NumberInput.mdx'

const NumberInputTemplate: Story<NumberInputProps> = (props) => (
  <Component {...props} />
)

export const NumberInput = NumberInputTemplate.bind({})

const argTypes: ComponentArgTypes<NumberInputProps> = {
  defaultValue: {
    control: { type: 'number' },
    defaultValue: 1,
  },
  min: {
    control: { type: 'number' },
    defaultValue: 0,
  },
  max: {
    control: { type: 'number' },
    defaultValue: 10,
  },
  disabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  onChange: {
    action: 'Input value changed',
    table: { disable: true },
  },
}

export default {
  title: 'Molecules/NumberInput',
  component: NumberInput,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
