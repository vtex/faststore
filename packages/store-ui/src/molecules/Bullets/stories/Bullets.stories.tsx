import type { Story } from '@storybook/react'
import type { MouseEvent } from 'react'
import React, { Fragment } from 'react'
import { action } from '@storybook/addon-actions'

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
  onClick: (_: MouseEvent, idx: number) => action(`called with ${idx}`),
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
