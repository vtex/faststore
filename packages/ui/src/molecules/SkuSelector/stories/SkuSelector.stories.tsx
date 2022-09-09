import type { Story, Meta } from '@storybook/react'
import React from 'react'
import { RadioOption } from '../../..'

import type { SkuSelectorProps } from '../SkuSelector'
import Component from '../SkuSelector'
import mdx from './SkuSelector.mdx'

const SkuSelectorTemplate: Story<SkuSelectorProps> = ({ testId }) => {
  const activeValue = 'Square'
  const options = [
    { label: 'Option round', value: 'Round' },
    { label: 'Option square', value: 'Square' },
  ]
  const variant = 'label'

  return (
    <Component
      testId={testId}
      variant={variant}
      options={options}
      activeValue={activeValue}
      label='Option'
    >
      {options.map((option, index) => {
        return (
          <RadioOption
            data-fs-sku-selector-option
            key={String(index)}
            label={option.label}
            value={option.value}
            checked={option.value === activeValue}
          >
            <span>{option.value}</span>
          </RadioOption>
        )
      })}
    </Component>
  )
}

export const SkuSelector = SkuSelectorTemplate.bind({})
SkuSelector.storyName = 'SkuSelector'

export default {
  title: 'Molecules/SkuSelector',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
