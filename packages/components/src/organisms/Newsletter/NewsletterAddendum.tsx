import React, { forwardRef } from 'react'
import type { HTMLAttributes, DetailedHTMLProps } from 'react'

export interface NewsletterAddendumProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  /**
   * Specifies the addendum for the subscription.
   */
  addendum?: string
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NewsletterAddendum = forwardRef<HTMLSpanElement, NewsletterAddendumProps>(
  function NewsletterAddendum(
    { addendum, testId = 'fs-newsletter-addendum', ...otherProps },
    ref
  ) {
    return (
      <span
        ref={ref}
        data-testid={testId}
        data-fs-newsletter-addendum
        {...otherProps}
      >
        {addendum}
      </span>
    )
  }
)

export default NewsletterAddendum
