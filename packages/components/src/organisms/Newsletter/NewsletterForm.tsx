import React, { ComponentPropsWithRef, PropsWithChildren } from 'react'
import { forwardRef } from 'react'

export interface NewsletterFormProps
  extends Omit<ComponentPropsWithRef<'form'>, 'onSubmit'> {
  /**
   * Function called when submit button is clicked.
   */
  onSubmit: () => void
}

const NewsletterForm = forwardRef<
  HTMLFormElement,
  PropsWithChildren<NewsletterFormProps>
>(function NewsletterForm({ children, onSubmit, ...otherProps }, ref) {
  return (
    <form ref={ref} data-fs-newsletter-form onSubmit={onSubmit} {...otherProps}>
      {children}
    </form>
  )
})

export default NewsletterForm
