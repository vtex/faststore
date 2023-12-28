import React, { PropsWithChildren } from 'react'
import { forwardRef } from 'react'

type ColorVariant = 'main' | 'light' | 'accent'

export interface NewsletterProps {
  /**
   * Enables the card Variant
   */
  card: Boolean
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant: ColorVariant
}

const Newsletter = forwardRef<
  HTMLDivElement,
  PropsWithChildren<NewsletterProps>
>(function Newsletter(
  { card, children, colorVariant = 'main', ...otherProps },
  ref
) {
  return (
    <div
      ref={ref}
      data-fs-content="newsletter"
      data-fs-newsletter={card ? 'card' : ''}
      data-fs-newsletter-color-variant={colorVariant}
      {...otherProps}
    >
      {children}
    </div>
  )
})

export default Newsletter
