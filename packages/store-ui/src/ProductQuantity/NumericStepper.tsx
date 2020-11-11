import React, { FC, Fragment, useCallback } from 'react'
import { Button, Flex, Input } from 'theme-ui'

export interface NumericStepperProps {
  htmlFor?: string
  variant?: string
  minValue: number
  maxValue?: number
  onChange: (quantity: number) => void
}

export const NumericStepper: FC<NumericStepperProps> = ({
  variant = 'productQuantity',
  htmlFor = 'product-quantity',
  minValue,
  maxValue = Infinity,
  onChange,
  children,
}) => {
  const [quantity, setQuantity] = React.useState<number>(1)

  const narrowedValue = useCallback(
    (value: number) => {
      return Math.min(Math.max(value, minValue), maxValue)
    },
    [maxValue, minValue]
  )

  const updateQuantity = useCallback(
    (value: number) => {
      value = narrowedValue(value)
      setQuantity(value)
      onChange(value)
    },
    [setQuantity, onChange, narrowedValue]
  )

  const isMax = quantity >= maxValue
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
        <Input
          id={htmlFor}
          value={quantity}
          variant={`${variant}.numericStepper.input`}
        />
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
