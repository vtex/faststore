import type { FormEvent, ComponentProps } from 'react'

export interface NewsletterFormProps
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  /**
   * Function called when submit button is clicked.
   */
  onSubmit: (event: FormEvent) => void
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NewsletterForm({
  children,
  onSubmit,
  testId = 'fs-newsletter-form',
  ref,
  ...otherProps
}: NewsletterFormProps) {
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
