import type { ComponentProps } from 'react'

export interface NewsletterContentProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NewsletterContent({
  children,
  testId = 'fs-newsletter-content',
  ref,
  ...otherProps
}: NewsletterContentProps) {
  return (
    <div
      ref={ref}
      data-testid={testId}
      data-fs-newsletter-content
      {...otherProps}
    >
      {children}
    </div>
  )
}
