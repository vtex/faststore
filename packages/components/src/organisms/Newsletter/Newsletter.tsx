import React, { forwardRef } from 'react'
import type { HTMLAttributes, DetailedHTMLProps } from 'react'

type ColorVariant = 'main' | 'light' | 'accent'

export interface NewsletterProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * Enables the card Variant
   */
  card: boolean
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant: ColorVariant
}

const Newsletter = forwardRef<HTMLDivElement, NewsletterProps>(
  function Newsletter(
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
  }
)

export default Newsletter
