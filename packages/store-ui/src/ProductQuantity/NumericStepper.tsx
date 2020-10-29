import React, { FC, Fragment, useCallback } from 'react'
import { Button, Flex, Input } from 'theme-ui'

export interface NumericStepperProps {
  variant?: string
  minValue: number | 1
  maxValue?: number | undefined
}

var currentQuantity = 1

export const getCurrentQuantity = () => {
  return currentQuantity
}

export const NumericStepper: FC<NumericStepperProps> = ({
  variant = 'productQuantity',
  minValue,
  maxValue,
  children,
}) => {
  var [quantity, setQuantity] = React.useState<number>(1)

  const updateQuantity = (value: number) => {
    currentQuantity = value
    setQuantity(value)
  }

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

  const isMax = maxValue ? quantity >= maxValue : false
  const isMin = quantity <= minValue

  return (
    <Fragment>
      <Flex variant={`${variant}.numericStepper`}>
        <Button
          variant={`${variant}.numericStepper.button.minus`}
          onClick={() => decreaseNumber()}
          disabled={isMin}
        >
          -
        </Button>
        <Input
          value={quantity}
          onChange={(e) => updateQuantity(Number(e.target.value))}
          variant={`${variant}.numericStepper.input`}
        />
        <Button
          variant={`${variant}.numericStepper.button.plus`}
          onClick={() => increaseNumber()}
          disabled={isMax}
        >
          +
        </Button>
        {children}
      </Flex>
    </Fragment>
  )
}
