import React from 'react'
import { forwardRef } from 'react'

export interface NewsletterAddendumProps {
  /**
   * Expects a string of a JSON object.
   */
  addendum: string
}

const NewsletterAddendum = forwardRef<HTMLSpanElement, NewsletterAddendumProps>(
  function NewsletterAddendum({ addendum, ...otherProps }, ref) {
    return (
      <span
        ref={ref}
        data-fs-newsletter-addendum
        dangerouslySetInnerHTML={{ __html: addendum }}
        {...otherProps}
      />
    )
  }
)

export default NewsletterAddendum
