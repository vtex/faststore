import React, { forwardRef } from 'react'
import Button from '../../atoms/Button'
import type { ButtonProps } from '../../atoms/Button'
import { useSKUMatrix } from '../../hooks'

export type SKUMatrixTriggerProps = ButtonProps

const SKUMatrixTrigger = forwardRef<HTMLButtonElement, SKUMatrixTriggerProps>(
  function SKUMatrixTrigger(
    { children, variant = 'secondary', onClick, ...otherProps },
    ref
  ) {
    const { setIsOpen } = useSKUMatrix()

    return (
      <Button
        ref={ref}
        variant={variant}
        onClick={(event) => {
          setIsOpen(true)
          onClick?.(event)
        }}
        {...otherProps}
      >
        {children}
      </Button>
    )
  }
)

export default SKUMatrixTrigger
