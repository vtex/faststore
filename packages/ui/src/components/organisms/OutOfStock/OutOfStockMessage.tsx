import React from 'react'

import type { OutOfStockBaseProps } from './OutOfStock'

export type OutOfStockMessageProps = {
  /**
   * Attribute used for polymorphic component.
   */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span'
} & OutOfStockBaseProps

export const OutOfStockMessage = ({
  as: MessageComponent = 'p',
  testId = 'store-out-of-stock-message',
  children,
  ...otherProps
}: OutOfStockMessageProps) => {
  return (
    <MessageComponent
      data-out-of-stock-message
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </MessageComponent>
  )
}
