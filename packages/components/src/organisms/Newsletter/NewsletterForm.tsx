import React, { forwardRef } from 'react'
import type { FormEvent, HTMLAttributes, DetailedHTMLProps } from 'react'

export interface NewsletterFormProps
  extends DetailedHTMLProps<
    Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'>,
    HTMLFormElement
  > {
  /**
   * Function called when submit button is clicked.
   */
  onSubmit: (event: FormEvent) => void
}

const NewsletterForm = forwardRef<HTMLFormElement, NewsletterFormProps>(
  function NewsletterForm({ children, onSubmit, ...otherProps }, ref) {
    return (
      <form
        ref={ref}
        data-fs-newsletter-form
        onSubmit={onSubmit}
        {...otherProps}
      >
        {children}
      </form>
    )
  }
)

export default NewsletterForm
