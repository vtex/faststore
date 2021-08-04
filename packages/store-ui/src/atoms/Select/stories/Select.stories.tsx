import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { SelectProps } from '../Select'
import Component from '../Select'
import mdx from './Select.mdx'

const SelectTemplate: Story<SelectProps> = ({ children, testId, props }) => {
  return (
    <Component testId={testId} {...props}>
      {children}
    </Component>
  )
}

export const Select = SelectTemplate.bind({})

const defaultOption = () => {
  return <option value="default">Default</option>
}

const argTypes: ComponentArgTypes<SelectProps> = {
  children: {
    control: { type: 'option' },
    defaultValue: defaultOption(),
  },
}

export default {
  title: 'Atoms/Select',
  component: Select,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
