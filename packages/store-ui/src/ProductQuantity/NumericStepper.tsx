import React, { FC, Fragment, useCallback } from 'react'
import { Box, Button, Flex, Input } from 'theme-ui'

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

  return (
    <Fragment>
      <Flex variant={`${variant}.numericStepper`}>
        <Button
          variant={`${variant}.numericStepper.button.minus`}
          aria-label="-"
          onClick={() => decreaseNumber()}
        ></Button>
        <Input>{displayValue}</Input>
        <Box variant={`${variant}.numericStepper.input`}></Box>
        <Button
          variant={`${variant}.numericStepper.button.plus`}
          aria-label="+"
          onClick={() => increaseNumber()}
        ></Button>
        {children}
      </Flex>
    </Fragment>
  )
}
