import React, { PropsWithChildren } from 'react'
import { forwardRef } from 'react'

const NewsletterContent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<unknown>
>(function NewsletterContent({ children, ...otherProps }, ref) {
  return (
    <div ref={ref} data-fs-newsletter-content {...otherProps}>
      {children}
    </div>
  )
})

export default NewsletterContent
