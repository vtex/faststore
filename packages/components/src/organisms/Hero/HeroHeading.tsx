import type { ReactNode, HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { Icon, LinkButton } from '../..'
import { ArrowRight } from '../../assets'

import { useHero } from './Hero'

export interface HeroHeadingProps extends HTMLAttributes<HTMLDivElement> {
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

const HeroHeading = forwardRef<HTMLDivElement, HeroHeadingProps>(
  function HeroHeading(
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
        <div data-fs-hero-wrapper className="layout__content">
          <div data-fs-hero-info>
            <h1 data-fs-hero-title>{title}</h1>
            <p data-fs-hero-subtitle>{subtitle}</p>
            {!!link && (
              <LinkButton
                href={link}
                inverse={colorVariant === 'main'}
                icon={<ArrowRight />}
                iconPosition="right"
              >
                {linkText}
              </LinkButton>
            )}
          </div>
          {icon && variant === 'secondary' && (
            <Icon data-fs-hero-icon component={icon} />
          )}
        </div>
      </header>
    )
  }
)

export default HeroHeading
