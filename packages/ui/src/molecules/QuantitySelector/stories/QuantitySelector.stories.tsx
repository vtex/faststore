import type { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import type { QuantitySelectorProps } from '../QuantitySelector'
import Component from '../QuantitySelector'
import { PlusIcon, MinusIcon } from './assets/Icons'
import mdx from './QuantitySelector.mdx'

const MAX_QUANTITY = 10
const MIN_QUANTITY = 1
const QuantitySelectorStylelessTemplate: Story<QuantitySelectorProps> = (_) => {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)

  function increase() {
    setQuantity((currentQuantity) =>
      Math.min(currentQuantity + 1, MAX_QUANTITY)
    )
  }

  function decrease() {
    setQuantity((currentQuantity) =>
      Math.max(currentQuantity - 1, MIN_QUANTITY)
    )
  }

  function isLeftDisabled() {
    return quantity === MIN_QUANTITY
  }

  function isRightDisabled() {
    return quantity === MAX_QUANTITY
  }

  return (
    <Component
      quantity={quantity}
      onClickLeft={decrease}
      onClickRight={increase}
      leftDisabled={isLeftDisabled()}
      rightDisabled={isRightDisabled()}
      readOnly
    />
  )
}

const QuantitySelectorDefaultTemplate: Story<QuantitySelectorProps> = (_) => {
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
      onClickLeft={decrease}
      onClickRight={increase}
      leftDisabled={isLeftDisabled()}
      rightDisabled={isRightDisabled()}
      rightIcon={<PlusIcon color={isRightDisabled() ? '#898F9E' : '#2953B2'} />}
      leftIcon={<MinusIcon color={isLeftDisabled() ? '#898F9E' : '#2953B2'} />}
      onChange={validateInput}
      readOnly={false}
    />
  )
}

export const Styleless = QuantitySelectorStylelessTemplate.bind({})
export const DefaultStyle = QuantitySelectorDefaultTemplate.bind({})

export default {
  title: 'Molecules/QuantitySelector',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
