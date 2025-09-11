import React from 'react'
import type { ReactNode, ComponentProps } from 'react'

export interface NewsletterHeaderProps extends ComponentProps<'header'> {
  /**
   * Icon for the section.
   */
  icon?: ReactNode
  /**
   * Title for the section.
   */
  title: string
  /**
   * A description for the section.
   */
  description?: string
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NewsletterHeader({
  icon,
  title,
  description,
  testId = 'fs-newsletter-header',
  ref,
  ...otherProps
}: NewsletterHeaderProps) {
  return (
    <header
      ref={ref}
      data-testid={testId}
      data-fs-newsletter-header
      {...otherProps}
    >
      <h3 data-fs-newsletter-header-title>
        {icon}
        {title}
      </h3>

      {description && (
        <span data-fs-newsletter-header-description>{description}</span>
      )}
    </header>
  )
}
