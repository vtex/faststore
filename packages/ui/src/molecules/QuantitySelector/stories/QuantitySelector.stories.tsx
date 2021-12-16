import type { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import type { QuantitySelectorProps } from '../QuantitySelector'
import Component from '../QuantitySelector'
import { PlusIcon, MinusIcon } from './assets/Icons'
import mdx from './QuantitySelector.mdx'

const MAX_QUANTITY = 10
const MIN_QUANTITY = 1

export const QuantitySelector: Story<QuantitySelectorProps> = () => {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)

  function increase() {
    setQuantity((currentQuantity) =>
      validateQuantityBounds(currentQuantity + 1)
    )
  }

  function decrease() {
    setQuantity((currentQuantity) =>
      validateQuantityBounds(currentQuantity - 1)
    )
  }

  function isLeftDisabled(): boolean {
    return quantity === MIN_QUANTITY
  }

  function isRightDisabled(): boolean {
    return quantity === MAX_QUANTITY
  }

  function validateQuantityBounds(n: number): number {
    return Math.min(Math.max(n, MIN_QUANTITY), MAX_QUANTITY)
  }

  function validateInput(e: React.FormEvent<HTMLInputElement>) {
    const val = e.currentTarget.value

    if (!Number.isNaN(Number(val))) {
      setQuantity(validateQuantityBounds(Number(val)))
    }
  }

  return (
    <Component
      className="quantitySelector"
      quantity={quantity}
      leftButtonProps={{
        onClick: decrease,
        disabled: isLeftDisabled(),
        icon: <MinusIcon color={isLeftDisabled() ? '#898F9E' : '#2953B2'} />,
      }}
      rightButtonProps={{
        onClick: increase,
        disabled: isRightDisabled(),
        icon: <PlusIcon color={isRightDisabled() ? '#898F9E' : '#2953B2'} />,
      }}
      inputProps={{
        onChange: validateInput,
        readOnly: false,
      }}
    />
  )
}

QuantitySelector.storyName = 'QuantitySelector'

export default {
  title: 'Molecules/QuantitySelector',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
