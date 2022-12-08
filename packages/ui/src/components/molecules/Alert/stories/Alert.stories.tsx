import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { AlertProps } from '../Alert'
import Component from '../Alert'
import { ShoppingCart } from '@faststore/components/src/assets'
import mdx from './Alert.mdx'
import { Icon } from '../../../../'

const AlertTemplate: Story<AlertProps> = ({ children }) => (
  <Component>{children}</Component>
)

export const Alert = AlertTemplate.bind({})
Alert.args = {
  children: 'Alert',
}

export const AlertWithIcon = AlertTemplate.bind({})
AlertWithIcon.args = {
  children: (
    <>
      <Icon component={<ShoppingCart />} />
      <span>Alert</span>
    </>
  ),
}

export default {
  title: 'Molecules/Alert',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
