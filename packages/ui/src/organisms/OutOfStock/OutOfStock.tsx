import React from 'react'
import type { ReactNode, FormHTMLAttributes } from 'react'

import Form from '../../molecules/Form'

export type OutOfStockBaseProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Children for Out of Stock components.
   */
  children: string | ReactNode
}

export type OutOfStockProps = OutOfStockBaseProps & {
  /**
   * Event emitted when form is submitted.
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
} & FormHTMLAttributes<HTMLFormElement>

const OutOfStock = ({
  testId = 'store-out-of-stock',
  children,
  ...otherProps
}: OutOfStockProps) => {
  return (
    <section data-store-out-of-stock data-testid={testId}>
      <Form data-out-of-stock-form testId={`${testId}-form`} {...otherProps}>
        {children}
      </Form>
    </section>
  )
}

export default OutOfStock
