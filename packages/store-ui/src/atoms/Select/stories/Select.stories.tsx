import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { SelectProps } from '../Select'
import Component from '../Select'
import mdx from './Select.mdx'

const SelectTemplate: Story<SelectProps> = ({ testId, options, ...props }) => {
  return <Component testId={testId} options={options} {...props} />
}

export const Select = SelectTemplate.bind({})

const argTypes: ComponentArgTypes<SelectProps> = {
  options: {
    control: { type: 'array' },
    defaultValue: [
      ['ok', 'ok'],
      ['bad', 'bad'],
    ],
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
