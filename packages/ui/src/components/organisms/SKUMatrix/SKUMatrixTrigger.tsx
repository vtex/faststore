import React from 'react'
import Button from '../../atoms/Button'
import type { ButtonProps } from '../../atoms/Button'
import { useSKUMatrix } from '../../hooks'

export type SKUMatrixTriggerProps = ButtonProps

export default function SKUMatrixTrigger({
  children,
  variant = 'secondary',
  onClick,
  ref,
  ...otherProps
}: SKUMatrixTriggerProps) {
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
