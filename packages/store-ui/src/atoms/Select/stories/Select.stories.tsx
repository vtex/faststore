import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { SelectProps } from '../Select'
import Component from '../Select'
import mdx from './Select.mdx'

const SelectTemplate: Story<SelectProps> = ({ options, ...props }) => {
  return <Component options={options} {...props} />
}

export const DefaultSelect = SelectTemplate.bind({})

export const DisabledSelect = SelectTemplate.bind({})
DisabledSelect.args = {
  disabled: true,
}

export const MultipleSelect = SelectTemplate.bind({})
MultipleSelect.args = {
  multiple: true,
}

export const BaseValueSelect = SelectTemplate.bind({})
BaseValueSelect.args = {
  defaultValue: 'ok',
}

const argTypes: ComponentArgTypes<SelectProps> = {
  options: {
    control: { type: 'array' },
    defaultValue: [
      ['great', 'Great'],
      ['ok', 'Ok'],
      ['bad', 'Bad'],
    ],
  },
}

export default {
  title: 'Atoms/Select',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
