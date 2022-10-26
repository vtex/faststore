import type { Meta, Story } from '@storybook/react'
import React from 'react'

import { Radio as Component, RadioProps } from '@faststore/components'
import type { ComponentArgTypes } from '../../../../typings/utils'
import mdx from './Radio.mdx'

const RadioTemplate: Story<RadioProps> = (props) => (
  <>
    <Component {...props} id="radio" />
    <label htmlFor="radio">Radio</label>
  </>
)

export const Radio = RadioTemplate.bind({})

const controls: ComponentArgTypes<RadioProps> = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
}

const actions: ComponentArgTypes<RadioProps> = {
  onClick: { action: 'clicked', table: { disable: true } },
}

export default {
  title: 'Atoms/Radio',
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
