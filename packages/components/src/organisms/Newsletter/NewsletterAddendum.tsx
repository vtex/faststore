import type { ComponentProps } from 'react'

export interface NewsletterAddendumProps extends ComponentProps<'span'> {
  /**
   * Specifies the addendum for the subscription.
   */
  addendum?: string
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NewsletterAddendum({
  addendum,
  testId = 'fs-newsletter-addendum',
  ref,
  ...otherProps
}: NewsletterAddendumProps) {
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
