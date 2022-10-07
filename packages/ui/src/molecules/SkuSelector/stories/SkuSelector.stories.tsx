import type { Story, Meta } from '@storybook/react'
import React from 'react'
import { RadioOption } from '../../..'

import type { SkuSelectorProps } from '../SkuSelector'
import Component from '../SkuSelector'
import mdx from './SkuSelector.mdx'

const SkuSelectorTemplate: Story<SkuSelectorProps> = ({ testId }) => {
  const activeValue = 'Pink'
  const options = [
    { label: 'Color Pink', value: 'Pink' },
    { label: 'Color White', value: 'White' },
  ]
  const variant = 'label'

  return (
    <Component
      testId={testId}
      variant={variant}
      options={options}
      activeValue={activeValue}
      label='Color'
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
