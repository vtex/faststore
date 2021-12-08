import React, { forwardRef } from 'react'
import type {
  ForwardedRef,
  HTMLAttributes,
  AriaAttributes,
  AnchorHTMLAttributes,
  PropsWithChildren,
} from 'react'

interface LinkAsDivProps extends HTMLAttributes<HTMLDivElement> {
  testId?: string
  ref?: ForwardedRef<HTMLDivElement>
  ariaLabel?: AriaAttributes['aria-label']
}

const LinkAsDiv = ({
  ref,
  testId,
  children,
  ariaLabel,
  ...otherProps
}: PropsWithChildren<LinkAsDivProps>) => {
  return (
    <div
      ref={ref}
      data-store-link
      data-testid={testId}
      aria-label={ariaLabel}
      {...otherProps}
    >
      {children}
    </div>
  )
}

interface LinkAsAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  testId?: string
  ariaLabel?: AriaAttributes['aria-label']
}

const LinkAsAnchor = ({
  href,
  testId,
  children,
  ariaLabel,
  ...otherProps
}: PropsWithChildren<LinkAsAnchorProps>) => {
  if (!href) {
    throw new Error('Missing required parameters for <a> tag: href')
  }

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      data-store-link
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </a>
  )
}

type ElementType = 'a' | 'div'

export interface LinkProps
  extends Omit<HTMLAttributes<HTMLDivElement | HTMLAnchorElement>, 'href'> {
  /**
   * Set the HTML tag of this component.
   */
  as?: ElementType
  /**
   * The URL the link points to
   */
  href?: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  'aria-label'?: AriaAttributes['aria-label']
}

const Link = forwardRef<HTMLDivElement, LinkProps>(function Link(
  {
    href,
    children,
    as = 'a',
    'aria-label': ariaLabel,
    testId = 'store-link',
    ...otherProps
  },
  ref
) {
  return as === 'div' ? (
    <LinkAsDiv ref={ref} ariaLabel={ariaLabel} testId={testId} {...otherProps}>
      {children}
    </LinkAsDiv>
  ) : (
    <LinkAsAnchor
      href={href}
      testId={testId}
      ariaLabel={ariaLabel}
      {...otherProps}
    >
      {children}
    </LinkAsAnchor>
  )
})

export default Link
