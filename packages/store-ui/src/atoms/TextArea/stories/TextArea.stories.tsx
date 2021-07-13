import React from 'react'
import type { Story, Meta, ArgTypes } from '@storybook/react'

import Component from '../TextArea'
import type { Props as TextAreaProps } from '../TextArea'
import mdx from './TextArea.mdx'

const TextAreaTemplate: Story<TextAreaProps> = (props) => {
  const colorByState: Record<
    NonNullable<TextAreaProps['state']> | 'default',
    string
  > = {
    default: 'black',
    success: 'green',
    error: 'red',
  }

  return (
    <Component
      style={{
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colorByState[props.state || 'default'],
      }}
      {...props}
    />
  )
}

export const TextArea = TextAreaTemplate.bind({})
TextArea.args = {
  defaultValue: 'Write something here',
}

const controls: ArgTypes = {
  state: {
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

const actions: ArgTypes = {
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
