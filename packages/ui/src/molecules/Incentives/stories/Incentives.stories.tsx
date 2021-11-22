import type { Story } from '@storybook/react'
import React from 'react'

import type { IncentivesProps } from '../Incentives'
import Component from '../Incentives'
import ShoppingCartIcon from '../../../atoms/Icon/stories/assets/ShoppingCart'
import mdx from './Incentives.mdx'

const IncentivesTemplate: Story<IncentivesProps> = ({ testId, incentives }) => (
  <Component testId={testId} incentives={incentives} />
)

export const Incentives = IncentivesTemplate.bind({})
Incentives.args = {
  incentives: [
    {
      title: 'A title',
      icon: <ShoppingCartIcon />,
      description: 'A great description',
    },
    {
      title: 'Another title',
      icon: <ShoppingCartIcon />,
      description: 'Another great description',
    },
  ],
}

export default {
  title: 'Molecules/Incentives',
  component: Incentives,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
