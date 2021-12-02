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
const QuantitySelectorStylelessTemplate: Story<QuantitySelectorCompoundProps> = (
  args
) => {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)

  function isLeftDisabled() {
    return quantity === MIN_QUANTITY
  }

  function isRightDisabled() {
    return quantity === MAX_QUANTITY
  }

  return (
    <QuantitySelector
      {...args}
      name="quantity-selector"
      currentValue={quantity}
      onClick={(v) => {
        if (v.currentTarget.name === 'quantity-selector-increase-button') {
          setQuantity((currentQuantity) =>
            Math.min(currentQuantity + 1, MAX_QUANTITY)
          )
        } else if (
          v.currentTarget.name === 'quantity-selector-decrease-button'
        ) {
          setQuantity((currentQuantity) =>
            Math.max(currentQuantity - 1, MIN_QUANTITY)
          )
        }
      }}
    >
      <QuantitySelectorButton
        name="quantity-selector-decrease-button"
        icon={<MinusIcon color="#fff" />}
        disabled={isLeftDisabled()}
      />
      <QuantitySelectorInput name="'quantity-selector-input'" readOnly />
      <QuantitySelectorButton
        name="quantity-selector-increase-button"
        icon={<PlusIcon color="#fff" />}
        disabled={isRightDisabled()}
      />
    </QuantitySelector>
  )
}

const QuantitySelectorDefaultTemplate: Story<QuantitySelectorCompoundProps> = (
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
    <div className="quantitySelector">
      <QuantitySelector
        {...args}
        name="quantity-selector"
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
          name="quantity-selector-decrease-button"
          icon={<MinusIcon color={minusColor} />}
        />
        <QuantitySelectorInput
          name="quantity-selector-input"
          onChange={validateInput}
          readOnly={false}
        />
        <QuantitySelectorButton
          name="quantity-selector-increase-button"
          icon={<PlusIcon color={plusColor} />}
        />
      </QuantitySelector>
    </div>
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
