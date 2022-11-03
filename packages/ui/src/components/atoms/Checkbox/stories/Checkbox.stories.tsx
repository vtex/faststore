import type { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'

import type { ComponentArgTypes } from '../../../../typings/utils'

import { Checkbox as Component, CheckboxProps } from '@faststore/components'
import mdx from './Checkbox.mdx'

const CheckboxTemplate: Story<CheckboxProps> = ({
  checked,
  onClick,
  ...otherProps
}) => {
  const [localChecked, setLocalChecked] = useState(checked)

  useEffect(() => {
    setLocalChecked(checked)
  }, [checked])

  return (
    <>
      <Component
        {...otherProps}
        checked={localChecked}
        onClick={(e) => {
          onClick?.(e)
          setLocalChecked(!localChecked)
        }}
        id="checkbox"
      />

      <label htmlFor="checkbox">Checkbox</label>
    </>
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
