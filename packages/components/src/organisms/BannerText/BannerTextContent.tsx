import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { LinkButton } from '../..'

import { useBannerText } from './BannerText'

export interface BannerTextContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The content for the h2 tag.
   */
  title: string
  /**
   * The content for the p tag below the h2.
   */
  caption: string
  /**
   * The href used at the link.
   */
  link: string
  /**
   * The label used at the link.
   */
  linkText: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const BannerTextContent = forwardRef<HTMLDivElement, BannerTextContentProps>(
  function BannerTextContent(
    {
      testId = 'fs-banner-text-content',
      title,
      caption,
      link,
      linkText,
      ...otherProps
    },
    ref
  ) {
    const { variant, colorVariant } = useBannerText()
    return (
      <header
        ref={ref}
        data-fs-banner-text-content
        data-fs-content="banner-text"
        data-testid={testId}
        {...otherProps}
      >
        <div
          data-fs-banner-text-heading
          data-fs-banner-text-color-variant={colorVariant}
        >
          <h2>{title}</h2>
          {variant === 'secondary' && caption && <p>{caption}</p>}
        </div>
        <LinkButton
          data-fs-banner-text-link
          href={link}
          variant={variant}
          inverse={colorVariant === 'main'}
          aria-label={linkText}
        >
          {linkText}
        </LinkButton>
      </header>
    )
  }
)

export default BannerTextContent
