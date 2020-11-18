import React, { FC } from 'react'
import { Button, Flex, Input } from 'theme-ui'

import { useNumericStepper } from './useNumericStepper'

export interface NumericStepperProps {
  id?: string
  variant?: string
  minValue: number
  maxValue?: number
  onChange: (quantity: number) => void
}

export const NumericStepper: FC<NumericStepperProps> = ({
  variant = 'productQuantity',
  id = 'product-quantity',
  minValue,
  maxValue = Infinity,
  onChange,
  children,
}) => {
  const { setValue, ...rest } = useNumericStepper({
    value: 1,
    min: minValue,
    max: maxValue,
    onChange,
  })

  const quantity = Number(rest.value)
  const isMax = quantity >= maxValue
  const isMin = quantity <= minValue

  return (
    <Flex variant={`${variant}.numericStepper`}>
      <Button
        variant={`${variant}.numericStepper.button.minus`}
        onClick={() => setValue(quantity - 1)}
        onDoubleClick={(e) => e.preventDefault()}
        disabled={isMin}
      >
        -
      </Button>
      <Input id={id} variant={`${variant}.numericStepper.input`} {...rest} />
      <Button
        variant={`${variant}.numericStepper.button.plus`}
        onClick={() => setValue(quantity + 1)}
        onDoubleClick={(e) => e.preventDefault()}
        disabled={isMax}
      >
        +
      </Button>
      {children}
    </Flex>
  )
}
