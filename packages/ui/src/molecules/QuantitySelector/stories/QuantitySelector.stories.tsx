import type { Meta, Story } from '@storybook/react'
import React, { useState, useMemo } from 'react'

import type {
  QuantitySelectorProps,
  QuantitySelectorButtonProps,
  QuantitySelectorInputProps,
} from '..'
import {
  QuantitySelector,
  QuantitySelectorButton,
  QuantitySelectorInput,
} from '..'
import { PlusIcon, MinusIcon } from './assets/Icons'
import mdx from './QuantitySelector.mdx'

const MAX_QUANTITY = 10
const MIN_QUANTITY = 1

type QuantitySelectorCompoundProps = QuantitySelectorProps &
  QuantitySelectorButtonProps &
  QuantitySelectorInputProps

export const QuantitySelectorDefault: Story<QuantitySelectorCompoundProps> = (
  args
) => {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)
  const { plusColor, minusColor } = useMemo(() => {
    return {
      plusColor: quantity === MAX_QUANTITY ? '#898F9E' : '#2953B2',
      minusColor: quantity === MIN_QUANTITY ? '#898F9E' : '#2953B2',
    }
  }, [quantity])

  function addQuantity(value: number) {
    setQuantity((currentQuantity) =>
      validateQuantityBounds(currentQuantity + value)
    )
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
    <QuantitySelector
      {...args}
      name="quantity-selector"
      className="quantitySelector"
      currentValue={quantity}
      onClick={(v) => {
        if (v.currentTarget.name === 'quantity-selector-increase-button') {
          addQuantity(1)
          v.currentTarget.disabled = quantity === MAX_QUANTITY
        } else if (
          v.currentTarget.name === 'quantity-selector-decrease-button'
        ) {
          addQuantity(-1)
          v.currentTarget.disabled = quantity === MIN_QUANTITY
        }
      }}
    >
      <QuantitySelectorButton
        aria-controls="quantity-selector-input"
        name="quantity-selector-decrease-button"
        aria-label="Decrement"
        icon={<MinusIcon color={minusColor} />}
      />
      <QuantitySelectorInput
        id="quantity-selector-input"
        name="quantity-selector-input"
        onChange={validateInput}
        readOnly={false}
      />
      <QuantitySelectorButton
        aria-controls="quantity-selector-input"
        name="quantity-selector-increase-button"
        aria-label="Increment"
        icon={<PlusIcon color={plusColor} />}
      />
    </QuantitySelector>
  )
}

QuantitySelectorDefault.storyName = 'QuantitySelector'

export default {
  title: 'Molecules/QuantitySelector',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
