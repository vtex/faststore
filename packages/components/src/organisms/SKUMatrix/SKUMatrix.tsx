import React, { forwardRef, HTMLAttributes } from 'react'
import SKUMatrixProvider from './provider/SKUMatrixProvider'

export interface SKUMatrixProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const SKUMatrix = forwardRef<HTMLDivElement, SKUMatrixProps>(function SKUMatrix(
  { testId = 'fs-sku-matrix', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-sku-matrix data-testid={testId} {...otherProps}>
      <SKUMatrixProvider>{children}</SKUMatrixProvider>
    </div>
  )
})

export default SKUMatrix
