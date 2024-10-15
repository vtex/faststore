import React, { forwardRef, HTMLAttributes } from 'react'
import SKUMatrixProvider from './provider/SKUMatrixProvider'

export type SKUMatrixProps = HTMLAttributes<HTMLDivElement>

const SKUMatrix = forwardRef<HTMLDivElement, SKUMatrixProps>(function SKUMatrix(
  { children, ...otherProps },
  ref
) {
  return (
    <div data-fs-sku-matrix ref={ref} {...otherProps}>
      <SKUMatrixProvider>{children}</SKUMatrixProvider>
    </div>
  )
})

export default SKUMatrix
