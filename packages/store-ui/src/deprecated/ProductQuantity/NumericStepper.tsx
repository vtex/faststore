import React from 'react'
import { Button, Flex, Input } from 'theme-ui'
import type { FC } from 'react'

import { useNumericStepper } from './useNumericStepper'

export interface NumericStepperProps {
  id?: string
  variant?: string
  min?: number
  max?: number
  value?: number
  disabled?: boolean
  onChange: (quantity: number) => void
}

export const NumericStepper: FC<NumericStepperProps> = ({
  variant = 'productQuantity',
  id = 'product-quantity',
  value = 1,
  min = 1,
  max = Infinity,
  disabled = false,
  onChange,
  children,
}) => {
  const { setValue, ...rest } = useNumericStepper({
    value,
    min,
    max,
    onChange,
  })

  const quantity = Number(rest.value)
  const isMax = quantity >= max
  const isMin = quantity <= min

  return (
    <Flex variant={`${variant}.numericStepper`}>
      <Button
        variant={`${variant}.numericStepper.button.minus`}
        data-testid="numericStepperMinus"
        onDoubleClick={(e) => e.preventDefault()}
        onClick={() => !disabled && setValue(quantity - 1)}
        disabled={disabled || isMin}
      >
        -
      </Button>
      <Input
        data-testid="numericStepperInput"
        id={id}
        variant={`${variant}.numericStepper.input`}
        {...rest}
        readOnly={disabled}
      />
      <Button
        variant={`${variant}.numericStepper.button.plus`}
        data-testid="numericStepperPlus"
        onDoubleClick={(e) => e.preventDefault()}
        onClick={() => !disabled && setValue(quantity + 1)}
        disabled={disabled || isMax}
      >
        +
      </Button>
      {children}
    </Flex>
  )
}
