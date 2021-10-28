import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { RadioProps } from '../Radio'
import Component from '../Radio'
import mdx from './Radio.mdx'

const RadioTemplate: Story<RadioProps> = (props) => <Component {...props} />

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
