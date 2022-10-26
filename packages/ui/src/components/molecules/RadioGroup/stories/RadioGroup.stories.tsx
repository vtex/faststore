import React, { useState } from 'react'
import type { Story } from '@storybook/react'

import type { RadioGroupProps, RadioOptionProps } from '..'
import RadioGroup from '../RadioGroup'
import RadioOption from '../RadioOption'
import mdx from './RadioGroup.mdx'

export const RadioGroupSimple: Story<RadioGroupProps & RadioOptionProps> = (
  args
) => {
  const [option, setOption] = useState<string | number>('')

  return (
    <>
      <RadioGroup
        {...args}
        name="radio-group"
        onChange={(v) => {
          setOption(v.currentTarget.value)
        }}
        selectedValue={option}
      >
        <RadioOption value="radio-1" label="Radio 1">
          <span>Radio 1</span>
        </RadioOption>
        <RadioOption value="radio-2" label="Radio 2">
          <span>Radio 2</span>
        </RadioOption>
      </RadioGroup>
    </>
  )
}

export const RadioOptionWithChildren: Story<
  RadioGroupProps & RadioOptionProps
> = (args) => {
  const [option, setOption] = useState<string | number>('')

  return (
    <>
      <RadioGroup
        {...args}
        name="radio-group-with-children"
        onChange={(v) => {
          setOption(v.currentTarget.value)
        }}
        selectedValue={option}
      >
        <RadioOption value="radio-1" label="Radio 1">
          <div>Radio 1</div>
        </RadioOption>
        <RadioOption value="radio-2" label="Radio 2">
          <div>Radio 2</div>
        </RadioOption>
        <RadioOption value="radio-3" label="Radio 3">
          <div>Radio 3</div>
        </RadioOption>
      </RadioGroup>
    </>
  )
}

export const RadioGroupControlled: Story<RadioGroupProps & RadioOptionProps> = (
  args
) => {
  const [option, setOption] = useState<string | number>('')

  return (
    <>
      <RadioGroup
        {...args}
        name="radio-group-controlled"
        onChange={(v) => {
          setOption(v.currentTarget.value)
        }}
        selectedValue={option}
      >
        <RadioOption value="radio-1" label="Radio 1">
          <span>Radio 1</span>
        </RadioOption>
        <RadioOption value="radio-2" label="Radio 2">
          <span>Radio 2</span>
        </RadioOption>
        <RadioOption value="radio-3" label="Radio 3">
          <span>Radio 3</span>
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
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
