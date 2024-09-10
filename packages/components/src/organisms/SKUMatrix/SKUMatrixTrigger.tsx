import React from 'react'
import type { ReactNode } from 'react'
import Button from '../../atoms/Button'
import type { ButtonProps } from '../../atoms/Button'

export interface SKUMatrixTriggerProps extends Pick<ButtonProps, 'variant'> {
  children: ReactNode
  onClick(): void
}

function SKUMatrixTrigger({
  children,
  variant = 'secondary',
  onClick,
}: SKUMatrixTriggerProps) {
  return (
    <Button data-fs-sku-matrix-trigger onClick={onClick} variant={variant}>
      {children}
    </Button>
  )
}

export default SKUMatrixTrigger
