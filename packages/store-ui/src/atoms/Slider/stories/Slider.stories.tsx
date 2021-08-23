import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { SliderProps } from '../Slider'
import Component from '../Slider'
import mdx from './Slider.mdx'

const SliderTemplate: Story<SliderProps> = (props) => <Component {...props} />

export const Slider = SliderTemplate.bind({})

const argTypes: ComponentArgTypes<SliderProps> = {
  min: {
    control: { type: 'text' },
    defaultValue: '0',
  },
  max: {
    control: { type: 'text' },
    defaultValue: '500',
  },
  showValues: {
    control: { type: 'boolean' },
    defaultValue: true,
  },
}

export default {
  title: 'Atoms/Slider',
  component: Slider,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
