import type { Story } from '@storybook/react'
import React, { Fragment } from 'react'

import type { BulletsProps } from '../Bullets'
import Component from '../Bullets'
import mdx from './Bullets.mdx'

const BulletsTemplate: Story<BulletsProps> = (args) => {
  return (
    <Fragment>
      <Component {...args} />
    </Fragment>
  )
}

export const Bullets = BulletsTemplate.bind({})
Bullets.args = {
  totalQuantity: 5,
  activeBullet: 3,
}

export default {
  title: 'Molecules/Bullets',
  component: Bullets,
  argTypes: {
    totalQuantity: {
      control: 'number',
      defaultValue: 5,
    },
    onClick: {
      action: 'Bullet clicked',
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
