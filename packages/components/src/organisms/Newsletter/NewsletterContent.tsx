import React, { forwardRef } from 'react'
import type { HTMLAttributes, DetailedHTMLProps } from 'react'

export type NewsletterContentProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

const NewsletterContent = forwardRef<HTMLDivElement, NewsletterContentProps>(
  function NewsletterContent({ children, ...otherProps }, ref) {
    return (
      <div ref={ref} data-fs-newsletter-content {...otherProps}>
        {children}
      </div>
    )
  }
)

export default NewsletterContent
