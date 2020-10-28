import React, { FC, Fragment, useCallback, useRef } from 'react'
import { Button, Flex, Input } from 'theme-ui'

export interface NumericStepperProps {
  variant?: string
  minValue: number | 1
  maxValue?: number | undefined
}

export const NumericStepper: FC<NumericStepperProps> = ({
  variant = 'productQuantity',
  minValue,
  maxValue,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  var displayValue = 1

  const increaseNumber = useCallback(() => {
    displayValue = displayValue + 1
    if (maxValue) {
      if (displayValue > maxValue) displayValue = maxValue
    }
  }, [displayValue, maxValue])

  const decreaseNumber = useCallback(() => {
    displayValue = displayValue - 1
    if (displayValue < minValue) displayValue = minValue
  }, [displayValue, minValue])

  const onChange = useCallback(() => {
    displayValue = displayValue - 1
    if (displayValue < minValue) displayValue = minValue
  }, [displayValue, minValue])

  const isMax = maxValue ? displayValue >= maxValue : false
  const isMin = displayValue <= minValue

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
          ref={inputRef}
          value={displayValue}
          onChange={onChange}
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
