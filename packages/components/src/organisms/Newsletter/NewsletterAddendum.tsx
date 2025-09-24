import type { ComponentProps } from 'react'
import RichText from '../../atoms/RichText'

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
