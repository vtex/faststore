import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'
import { Icon, LinkButton } from '../..'

import { useHero } from './Hero'

export interface HeroHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Content for the h1 tag.
   */
  title: string
  /**
   * Content for the p tag.
   */
  subtitle: string
  /**
   * Icon component for additional customization.
   */
  icon?: ReactNode
  /**
   * Specifies the URL the action button goes to.
   */
  link?: string
  /**
   * Specifies the action button's content.
   */
  linkText?: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroHeader = forwardRef<HTMLDivElement, HeroHeaderProps>(
  function HeroHeader(
    {
      icon,
      link,
      title,
      linkText,
      subtitle,
      children,
      testId = 'fs-hero-heading',
      ...otherProps
    },
    ref
  ) {
    const { variant, colorVariant } = useHero()
    return (
      <header
        ref={ref}
        data-fs-hero-heading
        data-testid={testId}
        {...otherProps}
      >
        <div data-fs-hero-wrapper data-fs-content="hero">
          <div data-fs-hero-info>
            <h1 data-fs-hero-title>{title}</h1>
            <p data-fs-hero-subtitle>{subtitle}</p>
            {!!link && (
              <LinkButton
                href={link}
                inverse={colorVariant === 'main'}
                icon={<Icon name="ArrowRight" />}
                iconPosition="right"
              >
                {linkText}
              </LinkButton>
            )}
          </div>
          {!!icon && variant === 'secondary' && (
            <span data-fs-hero-icon>{icon}</span>
          )}
        </div>
      </header>
    )
  }
)

export default HeroHeader
