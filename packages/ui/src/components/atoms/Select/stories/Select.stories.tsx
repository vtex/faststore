import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { SelectProps } from '../Select'
import Component from '../Select'
import mdx from './Select.mdx'

type SelectStoryProps = SelectProps & { options: string[][] }
const SelectTemplate: Story<SelectStoryProps> = ({ options, ...props }) => {
  return (
    <>
      <label htmlFor="select">Select:</label>
      <Component {...props} name="select" id="select">
        {options.map(([value, label]) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          )
        })}
      </Component>
    </>
  )
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

const argTypes: ComponentArgTypes<SelectStoryProps> = {
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
