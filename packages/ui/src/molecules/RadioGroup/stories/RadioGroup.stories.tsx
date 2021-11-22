import React, { useState } from 'react'
import type { Story } from '@storybook/react'

import type { RadioGroupProps, RadioOptionProps } from '..'
import { RadioGroup, RadioOption } from '..'
import mdx from './RadioGroup.mdx'

export const RadioGroupSimple: Story<RadioGroupProps & RadioOptionProps> = ({
  onChange,
  ...args
}) => {
  const [option, setOption] = useState<string | number>('')

  return (
    <>
      <RadioGroup
        {...args}
        name="radio-group"
        onChange={(v) => {
          setOption(v)
          onChange?.(v)
        }}
        value={option}
      >
        <RadioOption value="radio-1" label="Radio 1">
          Radio 1
        </RadioOption>
        <RadioOption value="radio-2" label="Radio 2">
          Radio 2
        </RadioOption>
      </RadioGroup>
    </>
  )
}

export const RadioOptionWithChildren: Story<
  RadioGroupProps & RadioOptionProps
> = ({ onChange, ...args }) => {
  const [option, setOption] = useState<string | number>('')

  return (
    <>
      <RadioGroup
        {...args}
        name="radio-group"
        onChange={(v) => {
          setOption(v)
          onChange?.(v)
        }}
        value={option}
      >
        <RadioOption value="radio-1" label="Radio 1">
          Radio 1
        </RadioOption>
        <RadioOption value="radio-2" label="Radio 2">
          <h2>Radio 2</h2>
        </RadioOption>
      </RadioGroup>
    </>
  )
}

export const RadioGroupControled: Story<RadioGroupProps & RadioOptionProps> = ({
  onChange,
  ...args
}) => {
  const [option, setOption] = useState<string | number>('')

  return (
    <>
      <RadioGroup
        {...args}
        name="radio-group"
        onChange={(v) => {
          setOption(v)
          onChange?.(v)
        }}
        value={option}
      >
        <RadioOption value="radio-1" label="Radio 1">
          Radio 1
        </RadioOption>
        <RadioOption value="radio-2" label="Radio 2">
          Radio 2
        </RadioOption>
      </RadioGroup>
      <br />
      <button
        onClick={() => {
          setOption('radio-3')
        }}
      >
        Check Radio 3
      </button>
    </>
  )
}

export default {
  title: 'Molecules/RadioGroup',
  argTypes: {
    onChange: { action: 'Selected Value' },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
