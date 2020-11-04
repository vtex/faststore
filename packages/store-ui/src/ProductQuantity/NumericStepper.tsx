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
  maxValue = Infinity,
  onChange,
  children,
}) => {
  var [quantity, setQuantity] = React.useState<number>(1)

  const narrowedValue = (value: number) => {
    return Math.min(Math.max(value, minValue), maxValue)
  }

  const updateQuantity = useCallback(
    (value: number) => {
      value = narrowedValue(value)
      setQuantity(value)
      onChange(value)
    },
    [setQuantity, onChange]
  )

  const isMax = maxValue ? quantity >= maxValue : false
  const isMin = quantity <= minValue

  return (
    <Fragment>
      <Flex variant={`${variant}.numericStepper`}>
        <Button
          variant={`${variant}.numericStepper.button.minus`}
          onClick={() => updateQuantity(quantity - 1)}
          disabled={isMin}
        >
          -
        </Button>
        <Input value={quantity} variant={`${variant}.numericStepper.input`} />
        <Button
          variant={`${variant}.numericStepper.button.plus`}
          onClick={() => updateQuantity(quantity + 1)}
          disabled={isMax}
        >
          +
        </Button>
        {children}
      </Flex>
    </Fragment>
  )
}
