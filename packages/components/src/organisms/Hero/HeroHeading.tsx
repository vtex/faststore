import type { ReactNode, HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { Icon } from '../../index'

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
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroHeading = forwardRef<HTMLDivElement, HeroHeadingProps>(
  function HeroHeading(
    { title, subtitle, icon, testId = 'fs-hero-heading', children, ...otherProps },
    ref
  ) {
    return (
      <header ref={ref} data-fs-hero-heading data-testid={testId} {...otherProps}>
        <div data-fs-hero-wrapper className="layout__content">
          <div data-fs-hero-info>
            <h1 data-fs-hero-title>{title}</h1>
            <p data-fs-hero-subtitle>{subtitle}</p>
          </div>
          {icon && (
            <Icon data-fs-hero-icon component={icon} />
          )}
        </div>
      </header>
    )
  }
)

export default HeroHeading
