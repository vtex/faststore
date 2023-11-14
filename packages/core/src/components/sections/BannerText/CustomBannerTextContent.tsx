import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { LinkButton, BannerTextProps } from '@faststore/ui'

// import { useBannerText } from '../BannerText'
// import { useProductLink } from '@faststore/ui/src/components/organisms/BannerText/'

export interface CustomBannerTextContentProps
  extends HTMLAttributes<HTMLDivElement> {
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
   * Link opens in a new tab is true
   */
  targetBlank?: boolean
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  colorVariant?: BannerTextProps['colorVariant']
  variant?: BannerTextProps['variant']
}

const CustomBannerTextContent = forwardRef<
  HTMLDivElement,
  CustomBannerTextContentProps
>(function CustomBannerTextContent(
  {
    testId = 'fs-banner-text-content',
    title,
    caption,
    link,
    linkText,
    variant,
    colorVariant,
    targetBlank,
    ...otherProps
  },
  ref
) {
  // const { variant, colorVariant } = useBannerText()
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
        target={targetBlank ? '_blank' : undefined}
      >
        {linkText}
      </LinkButton>
    </header>
  )
})

export default CustomBannerTextContent
