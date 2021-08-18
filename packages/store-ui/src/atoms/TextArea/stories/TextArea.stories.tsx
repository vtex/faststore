import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentArgTypes } from 'typings/utils'

import type { TextAreaProps } from '../TextArea'
import Component from '../TextArea'
import mdx from './TextArea.mdx'

const TextAreaTemplate: Story<TextAreaProps> = (props) => (
  <Component {...props} />
)

export const TextArea = TextAreaTemplate.bind({})
TextArea.args = {
  defaultValue: 'Write something here',
}

const controls: ComponentArgTypes<TextAreaProps> = {
  variant: {
    options: ['default', 'success', 'error'],
    defaultValue: 'default',
    control: { type: 'select' },
  },
  value: {
    control: {
      type: 'text',
    },
  },
  defaultValue: {
    table: { disable: true },
  },
}

const actions: ComponentArgTypes<TextAreaProps> = {
  onChange: { action: 'changed', table: { disable: true } },
}

export default {
  title: 'Atoms/TextArea',
  component: TextArea,
  argTypes: {
    ...controls,
    ...actions,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
