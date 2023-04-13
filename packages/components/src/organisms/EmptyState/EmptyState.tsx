import React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'

type Variant = 'default' | 'rounded'

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
}

function EmptyState({
  testId = 'fs-empty-state',
  variant = 'default',
  title,
  titleIcon,
  children,
  ...otherProps
}: PropsWithChildren<EmptyStateProps>) {
  return (
    <section
      data-fs-empty-state
      data-fs-empty-state-variant={variant}
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
