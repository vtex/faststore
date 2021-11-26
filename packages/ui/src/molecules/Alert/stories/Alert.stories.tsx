import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { AlertProps } from '../Alert'
import Component from '../Alert'
import ShoppingCartIcon from '../../../atoms/Icon/stories/assets/ShoppingCart'
import mdx from './Alert.mdx'

const AlertTemplate: Story<AlertProps> = ({ testId, icon, children }) => (
  <Component testId={testId} icon={icon}>
    {children}
  </Component>
)

const icons = { ShoppingCartIcon: <ShoppingCartIcon /> }

export const Alert = AlertTemplate.bind({})
Alert.args = {
  icon: <ShoppingCartIcon />,
}

export const AlertWithoutIcon = AlertTemplate.bind({})
AlertWithoutIcon.args = {}

const argTypes: ComponentArgTypes<AlertProps> = {
  icon: {
    options: [null, ...Object.keys(icons)], // An array of serializable values
    mapping: icons, // Maps serializable option values to complex arg values
    control: {
      type: 'select',
      labels: {
        // 'labels' maps option values to string labels
        null: 'Without icon',
        ShoppingCartIcon: 'Shopping Cart Icon',
      },
    },
  },
  children: {
    control: { type: 'text' },
    defaultValue: 'Alert',
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
