import React, { forwardRef } from 'react'
import type { HTMLAttributes, DetailedHTMLProps } from 'react'

export interface NewsletterContentProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NewsletterContent = forwardRef<HTMLDivElement, NewsletterContentProps>(
  function NewsletterContent(
    { children, testId = 'fs-newsletter-content', ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-testid={testId}
        data-fs-newsletter-content
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default NewsletterContent
