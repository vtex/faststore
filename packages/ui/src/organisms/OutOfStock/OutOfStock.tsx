import React from 'react'
import type { ReactNode, FormHTMLAttributes } from 'react'

import Form from '../../molecules/Form'

export type OutOfStockProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The Out of Stock Section's title.
   */
  title: string | ReactNode
  /**
   * Message describing when the user will be notified.
   */
  message?: string | ReactNode
  /**
   *
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  /**
   *
   */
  children: ReactNode
} & FormHTMLAttributes<HTMLFormElement>

function OutOfStock({
  testId = 'store-out-of-stock',
  title,
  message,
  children,
  ...formProps
}: OutOfStockProps) {
  return (
    <section data-store-out-of-stock data-testid={testId} aria-live="polite">
      <Form
        data-store-out-of-stock-form
        testId={`${testId}-form`}
        {...formProps}
      >
        <p data-store-out-of-stock-title data-testid={`${testId}-title`}>
          {title}
        </p>
        {!!message && (
          <p data-store-out-of-stock-message data-testid={`${testId}-message`}>
            {message}
          </p>
        )}
        {children}
      </Form>
    </section>
  )
}

export default OutOfStock
