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
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NewsletterForm = forwardRef<HTMLFormElement, NewsletterFormProps>(
  function NewsletterForm(
    { children, onSubmit, testId = 'fs-newsletter-form', ...otherProps },
    ref
  ) {
    return (
      <form
        ref={ref}
        data-testid={testId}
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
