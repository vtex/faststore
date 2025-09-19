import type { ComponentProps } from 'react'
import { ProductComparisonProvider } from '.'

export interface ProductComparisonProps extends ComponentProps<'div'> {
  /*
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export default function ProductComparison({
  testId = 'fs-product-comparison',
  children,
  ref,
  ...otherProps
}: ProductComparisonProps) {
  return (
    <div ref={ref} data-testid={testId} {...otherProps}>
      <ProductComparisonProvider>{children}</ProductComparisonProvider>
    </div>
  )
}
