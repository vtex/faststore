import type { ComponentProps } from 'react'
import SKUMatrixProvider from './provider/SKUMatrixProvider'

export interface SKUMatrixProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function SKUMatrix({
  testId = 'fs-sku-matrix',
  children,
  ref,
  ...otherProps
}: SKUMatrixProps) {
  return (
    <div ref={ref} data-fs-sku-matrix data-testid={testId} {...otherProps}>
      <SKUMatrixProvider>{children}</SKUMatrixProvider>
    </div>
  )
}
