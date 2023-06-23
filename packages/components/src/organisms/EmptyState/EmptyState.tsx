import React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'

type Variant = 'default' | 'rounded'
type BackgroundColor = 'default' | 'light'

export interface EmptyStateProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The EmptyState component's title.
   */
  title?: string
  /**
   * A React component that will be rendered as an icon on the Title.
   */
  titleIcon?: ReactNode
  /**
   * Specifies the component border variant.
   */
  variant?: Variant
  /**
   * Specifies the component background color.
   */
  bkgColor?: BackgroundColor
}

function EmptyState({
  testId = 'fs-empty-state',
  title,
  titleIcon,
  variant = 'default',
  bkgColor = 'default',
  children,
  ...otherProps
}: PropsWithChildren<EmptyStateProps>) {
  return (
    <section
      data-fs-empty-state
      data-fs-empty-state-variant={variant}
      data-fs-empty-state-bkg-color={bkgColor}
      data-fs-content="empty-state"
      data-testid={testId}
      {...otherProps}
    >
      {title && (
        <header data-fs-empty-state-title>
          {titleIcon && <>{titleIcon}</>}
          <p>{title}</p>
        </header>
      )}
      {children}
    </section>
  )
}

export default EmptyState
