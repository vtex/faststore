import type { ComponentProps } from 'react'

type ColorVariant = 'main' | 'light' | 'accent'

export interface NewsletterProps extends ComponentProps<'div'> {
  /**
   * Enables the card Variant.
   */
  card: boolean
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant?: ColorVariant
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function Newsletter({
  card,
  children,
  colorVariant = 'main',
  testId = 'fs-newsletter',
  ref,
  ...otherProps
}: NewsletterProps) {
  return (
    <div
      ref={ref}
      data-testid={testId}
      data-fs-content="newsletter"
      data-fs-newsletter={card ? 'card' : ''}
      data-fs-newsletter-color-variant={colorVariant}
      {...otherProps}
    >
      {children}
    </div>
  )
}
