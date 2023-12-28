import React, { ReactNode } from 'react'
import { forwardRef } from 'react'

export interface NewsletterHeaderProps {
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
}

const NewsletterHeader = forwardRef<HTMLHeadElement, NewsletterHeaderProps>(
  function NewsletterHeader({ icon, title, description, ...otherProps }, ref) {
    return (
      <header ref={ref} data-fs-newsletter-header {...otherProps}>
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
