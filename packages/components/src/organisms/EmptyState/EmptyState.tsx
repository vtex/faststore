import React, { ReactNode } from 'react'
import type { PropsWithChildren } from 'react'

type Variant = 'default' | 'rounded'

export interface EmptyStateProps {
  /**
   * Specifies the component border variant.
   */
  variant?: Variant
  title?: string
  titleIcon?: ReactNode
}

function EmptyState({
  variant = 'default',
  title,
  titleIcon,
  children,
}: PropsWithChildren<EmptyStateProps>) {
  return (
    <section data-fs-empty-state data-fs-empty-state-variant={variant}>
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
