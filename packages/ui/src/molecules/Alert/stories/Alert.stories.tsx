import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { AlertProps } from '../Alert'
import Component from '../Alert'
import ShoppingCartIcon from '../../../atoms/Icon/stories/assets/ShoppingCart'
import mdx from './Alert.mdx'

const AlertTemplate: Story<AlertProps> = ({
  testId,
  dismissible,
  children,
  onClose,
}) => (
  <Component
    testId={testId}
    icon={<ShoppingCartIcon />}
    dismissible={dismissible}
    onClose={onClose}
  >
    {children}
  </Component>
)

export const Alert = AlertTemplate.bind({})

const argTypes: ComponentArgTypes<AlertProps> = {
  // icon: {
  //   control: { type: 'text' },
  // },
  dismissible: {
    control: {
      type: 'boolean',
    },
  },
  children: {
    control: { type: 'text' },
    defaultValue: 'Alert',
  },
  onClose: {
    action: 'Alert closed',
  },
}

export default {
  title: 'Molecules/Alert',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
