import type { Story } from '@storybook/react'
import React from 'react'

import type { IncentivesProps } from '../Incentives'
import Component from '../Incentives'
import ComponentItem from '../IncentivesItem'
import { GuaranteeIcon, QualityIcon, SafetyIcon, ShippingIcon } from './assets'
import mdx from './Incentives.mdx'

const IncentivesTemplate: Story<IncentivesProps> = ({ testId }) => (
  <Component testId={testId}>
    <ComponentItem>
      <SafetyIcon />
      <span>Trusted by SafeCompany</span>
    </ComponentItem>
    <ComponentItem>
      <QualityIcon />
      <span>Quality Products</span>
    </ComponentItem>
    <ComponentItem>
      <GuaranteeIcon />
      <span>3-year Guarantee</span>
    </ComponentItem>
    <ComponentItem>
      <ShippingIcon />
      <span>Free Shipping</span>
    </ComponentItem>
  </Component>
)

export const Incentives = IncentivesTemplate.bind({})

export default {
  title: 'Molecules/Incentives',
  component: Incentives,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
