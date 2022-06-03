import React from 'react'

import type { OutOfStockBaseProps } from './OutOfStock'

export type OutOfStockTitleProps = {
  /**
   * Attribute used for polymorphic component.
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
} & OutOfStockBaseProps

export const OutOfStockTitle = ({
  as: TitleComponent = 'h2',
  testId = 'store-out-of-stock-title',
  children,
  ...otherProps
}: OutOfStockTitleProps) => {
  return (
    <TitleComponent
      data-out-of-stock-title
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </TitleComponent>
  )
}
