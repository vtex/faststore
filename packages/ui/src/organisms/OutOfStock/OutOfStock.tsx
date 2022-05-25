import React from 'react'
import type { ReactNode, FormHTMLAttributes } from 'react'

import Form from '../../molecules/Form'

type OutOfStockBaseProps = {
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
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Event emitted when form is submitted.
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
} & FormHTMLAttributes<HTMLFormElement>

export type OutOfStockTitleProps = {
  /**
   * Attribute used for polymorphic component.
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
} & OutOfStockBaseProps

export type OutOfStockMessageProps = {
  /**
   * Attribute used for polymorphic component.
   */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span'
} & OutOfStockBaseProps

const OutOfStock = ({
  testId = 'store-out-of-stock',
  children,
  ...otherProps
}: OutOfStockProps) => {
  return (
    <section data-store-out-of-stock data-testid={testId}>
      <Form
        data-store-out-of-stock-form
        testId={`${testId}-form`}
        {...otherProps}
      >
        {children}
      </Form>
    </section>
  )
}

const Title = ({
  as: TitleComponent = 'h2',
  testId = 'store-out-of-stock-title',
  children,
}: OutOfStockTitleProps) => {
  return (
    <TitleComponent data-store-out-of-stock-title data-testid={testId}>
      {children}
    </TitleComponent>
  )
}

const Message = ({
  as: MessageComponent = 'p',
  testId = 'store-out-of-stock-message',
  children,
}: OutOfStockMessageProps) => {
  return (
    <MessageComponent data-store-out-of-stock-message data-testid={testId}>
      {children}
    </MessageComponent>
  )
}

OutOfStock.Title = Title
OutOfStock.Message = Message

export default OutOfStock
