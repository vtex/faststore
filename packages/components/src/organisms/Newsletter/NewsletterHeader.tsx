import React, { forwardRef } from 'react'
import type { ReactNode, HTMLAttributes, DetailedHTMLProps } from 'react'

export interface NewsletterHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement> {
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
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NewsletterHeader = forwardRef<HTMLHeadElement, NewsletterHeaderProps>(
  function NewsletterHeader(
    {
      icon,
      title,
      description,
      testId = 'fs-newsletter-header',
      ...otherProps
    },
    ref
  ) {
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
)

export default NewsletterHeader
