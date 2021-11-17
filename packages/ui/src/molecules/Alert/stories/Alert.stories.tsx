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
  icon,
  children,
  onClose,
}) => (
  <Component
    testId={testId}
    icon={icon}
    dismissible={dismissible}
    onClose={onClose}
  >
    {children}
  </Component>
)

export const Alert = AlertTemplate.bind({})
Alert.args = {
  icon: <ShoppingCartIcon />,
}

export const AlertWithoutIcon = AlertTemplate.bind({})
AlertWithoutIcon.args = {}

export const AlertWithDismissButton = AlertTemplate.bind({})
AlertWithDismissButton.args = { dismissible: true }

export const AlertWithAction = AlertTemplate.bind({})
AlertWithAction.args = {
  children: (
    <>
      Alert <a href="/">Action</a>
    </>
  ),
}

const argTypes: ComponentArgTypes<AlertProps> = {
  icon: {
    control: { type: 'select' },
    // eslint-disable-next-line react/jsx-key
    options: [<ShoppingCartIcon />],
  },
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
