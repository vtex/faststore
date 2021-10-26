import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { LabelProps } from '../Label'
import Component from '../Label'
import mdx from './Label.mdx'

const LabelTemplate: Story<LabelProps> = ({ children }) => (
  <Component>{children}</Component>
)

export const Label = LabelTemplate.bind({})

const argTypes: ComponentArgTypes<LabelProps> = {
  children: {
    control: { type: 'text' },
    defaultValue: 'Label',
  },
}

export default {
  title: 'Atoms/Label',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
