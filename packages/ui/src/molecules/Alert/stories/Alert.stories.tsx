import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { AlertProps } from '../Alert'
import Component from '../Alert'
import ShoppingCartIcon from '../../../atoms/Icon/stories/assets/ShoppingCart'
import mdx from './Alert.mdx'
import { Icon } from '../../..'

const AlertTemplate: Story<AlertProps> = ({ testId, children }) => (
  <Component testId={testId}>{children}</Component>
)

export const Alert = AlertTemplate.bind({})
Alert.args = {
  children: 'Alert',
}

export const AlertWithIcon = AlertTemplate.bind({})
AlertWithIcon.args = {
  children: (
    <>
      <Icon component={<ShoppingCartIcon />} />
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
