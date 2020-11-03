import React, { FC, Fragment, useCallback } from 'react'
import { Button, Flex, Input } from 'theme-ui'

export interface NumericStepperProps {
  variant?: string
  minValue: number | 1
  maxValue?: number | undefined
  onChange: (quantity: number) => void
}

export const NumericStepper: FC<NumericStepperProps> = ({
  variant = 'productQuantity',
  minValue,
  maxValue,
  onChange,
  children,
}) => {
  var [quantity, setQuantity] = React.useState<number>(1)

  const updateQuantity = useCallback(
    (value: number) => {
      setQuantity(value)
      onChange(value)
    },
    [setQuantity, onChange]
  )

  const increaseNumber = useCallback(() => {
    quantity = quantity + 1
    if (maxValue) {
      if (quantity > maxValue) quantity = maxValue
    }
    updateQuantity(quantity)
  }, [quantity, maxValue])

  const decreaseNumber = useCallback(() => {
    quantity = quantity - 1
    if (quantity < minValue) quantity = minValue
    updateQuantity(quantity)
  }, [quantity, minValue])

  const setNumber = useCallback(
    (value: number) => {
      quantity = value
      if (quantity < minValue) quantity = minValue
      if (maxValue) {
        if (quantity > maxValue) quantity = maxValue
      }
      updateQuantity(quantity)
    },
    [quantity, minValue, maxValue]
  )

  const isMax = maxValue ? quantity >= maxValue : false
  const isMin = quantity <= minValue

  return (
    <Fragment>
      <Flex variant={`${variant}.numericStepper`}>
        <Button
          variant={`${variant}.numericStepper.button.minus`}
          onClick={decreaseNumber}
          disabled={isMin}
        >
          -
        </Button>
        <Input
          value={quantity}
          onChange={(e) => setNumber(Number(e.target.value))}
          variant={`${variant}.numericStepper.input`}
        />
        <Button
          variant={`${variant}.numericStepper.button.plus`}
          onClick={increaseNumber}
          disabled={isMax}
        >
          +
        </Button>
        {children}
      </Flex>
    </Fragment>
  )
}
