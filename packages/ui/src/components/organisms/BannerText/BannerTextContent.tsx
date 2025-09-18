import type { ComponentProps } from 'react'
import React from 'react'
import { LinkButton } from '../..'

import { useBannerText } from './BannerText'

export interface BannerTextContentProps extends ComponentProps<'div'> {
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
   * Specify if the link opens in a new tab.
   */
  linkTargetBlank?: boolean
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function BannerTextContent({
  testId = 'fs-banner-text-content',
  title,
  caption,
  link,
  linkText,
  linkTargetBlank,
  ref,
  ...otherProps
}: BannerTextContentProps) {
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
        target={linkTargetBlank ? '_blank' : undefined}
      >
        {linkText}
      </LinkButton>
    </header>
  )
}
