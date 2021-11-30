import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { PaymentMethodsProps } from '../PaymentMethods'
import Component from '../PaymentMethods'
import mdx from './PaymentMethods.mdx'
import { VisaCard, MasterCard } from './assets/Icons'

const PaymentMethodsTemplate: Story<PaymentMethodsProps> = ({ testId }) => (
  <Component
    testId={testId}
    title="Payment Methods"
    flags={[<VisaCard key="visa" />, <MasterCard key="mastercard" />]}
  >
    {}
  </Component>
)

export const PaymentMethods = PaymentMethodsTemplate.bind({})
PaymentMethods.storyName = 'PaymentMethods'

export default {
  title: 'Molecules/PaymentMethods',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
