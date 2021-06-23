import type { Meta, Story } from '@storybook/react'
import type { MouseEvent } from 'react'
import React, { useState, Fragment } from 'react'

import type { BulletsProps } from './Bullets'
import Bullets from './Bullets'

export default {
  title: 'Atoms/Bullets',
} as Meta

const BulletsTemplate: Story<BulletsProps> = (args) => {
  const [activeBullet, setActiveBullet] = useState(3)

  const handleClick = (_: MouseEvent, idx: number) => {
    setActiveBullet(idx)
  }

  return (
    <Fragment>
      <Bullets
        activeBullet={activeBullet}
        totalQuantity={args.totalQuantity}
        onClick={handleClick}
      />
      <p>{`The currently active bullet is ${
        activeBullet + 1
      } (index ${activeBullet})`}</p>
    </Fragment>
  )
}

export const Default = BulletsTemplate.bind({})
Default.args = {
  totalQuantity: 5,
}
