import type { Story, Meta } from '@storybook/react'
import React, { useEffect, useState } from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { CheckboxProps } from '../Checkbox'
import Component from '../Checkbox'
import mdx from './Checkbox.mdx'

const CheckboxTemplate: Story<CheckboxProps> = ({
  checked,
  onClick,
  ...props
}) => {
  const [localChecked, setLocalChecked] = useState(checked)

  useEffect(() => {
    setLocalChecked(checked)
  }, [checked])

  return (
    <Component
      {...props}
      checked={localChecked}
      onClick={(e) => {
        onClick?.(e)
        setLocalChecked(!localChecked)
      }}
    />
  )
}

export const Checkbox = CheckboxTemplate.bind({})
Checkbox.args = {
  checked: true,
}

const controls: ComponentArgTypes<CheckboxProps> = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
}

const actions: ComponentArgTypes<CheckboxProps> = {
  onClick: { action: 'clicked', table: { disable: true } },
}

export default {
  title: 'Atoms/Checkbox',
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
