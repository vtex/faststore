import React, { forwardRef } from 'react'
import type { HTMLAttributes, DetailedHTMLProps } from 'react'
import RichText from '../../atoms/RichText'

export interface NewsletterAddendumProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  /**
   * Specifies the addendum for the subscription.
   */
  addendum?: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const NewsletterAddendum = forwardRef<HTMLSpanElement, NewsletterAddendumProps>(
  function NewsletterAddendum(
    { addendum, testId = 'fs-newsletter-addendum', ...otherProps },
    ref
  ) {
    if (!addendum) {
      return null
    }

    return (
      <RichText
        as="span"
        content={addendum}
        testId={testId}
        data-fs-newsletter-addendum
        {...otherProps}
        ref={ref}
      />
    )
  }
)

export default NewsletterAddendum
