import React from 'react'
import type { Story } from '@storybook/react'

import type { AlertProps } from '../Alert'
import Component from '../Alert'
import mdx from './Form.mdx'

const AlertTemplate: Story<AlertProps> = ({ testId }) => {
  return <Component testId={testId} />
}

export const Alert = AlertTemplate.bind({})

export default {
  title: 'Molecules/Alert',
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
