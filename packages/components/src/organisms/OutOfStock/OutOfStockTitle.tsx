import React, { ReactNode } from 'react'

export type OutOfStockTitleProps = {
  /**
   * Attribute used for polymorphic component.
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * A react component to be used as the title.
   */
  children: ReactNode
}

const OutOfStockTitle = ({
  as: TitleComponent = 'h2',
  testId = 'fs-out-of-stock-title',
  children,
  ...otherProps
}: OutOfStockTitleProps) => {
  return (
    <TitleComponent
      data-fs-out-of-stock-title
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </TitleComponent>
  )
}

export default OutOfStockTitle
