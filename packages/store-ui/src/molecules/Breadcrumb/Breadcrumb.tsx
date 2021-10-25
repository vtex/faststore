import type {
  HTMLAttributes,
  AnchorHTMLAttributes,
  ElementType,
  ReactNode,
  PropsWithChildren,
} from 'react'
import React, { forwardRef, Fragment } from 'react'

import Icon from '../../atoms/Icon'

export type BreadcrumbLevelType = {
  href: string
  text: string
}

const DefaultLink = ({
  children,
  ...otherProps
}: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...otherProps}>{children}</a>

const DefaultHomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
  </svg>
)

const DefaultDividerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 180 180">
    <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
  </svg>
)

export interface BreadcrumbProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Array with each level of the breadcrumb, containing link and text.
   */
  breadcrumb: BreadcrumbLevelType[]
  /**
   * A component that will be rendered as the Divider icon.
   */
  dividerIcon?: ReactNode
  /**
   * A component that will be rendered as the Home icon.
   */
  homeIcon?: ReactNode
  /**
   * A component link that will replace the HTML Anchor.
   */
  linkComponent?: ElementType<
    PropsWithChildren<{ href?: string; to?: string; 'data-testid'?: string }>
  >
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  function Breadcrumb(
    {
      breadcrumb,
      children,
      homeIcon = <DefaultHomeIcon />,
      dividerIcon = <DefaultDividerIcon />,
      linkComponent: Link = DefaultLink,
      testId = 'store-breadcrumb',
      ...otherProps
    },
    ref
  ) {
    return (
      <div ref={ref} data-store-breadcrumb data-testid={testId} {...otherProps}>
        <Link
          data-testid={`${testId}-home`}
          data-store-breadcrumb-home
          href="/"
          to="/"
        >
          <Icon component={homeIcon} />
        </Link>
        {breadcrumb.map(({ href, text }, index) => (
          <Fragment key={index}>
            <Icon component={dividerIcon} />
            <Link
              data-testid={`${testId}-item`}
              data-store-breadcrumb-item
              data-store-breadcrumb-item-active={
                index === breadcrumb.length - 1 || undefined
              }
              key={index}
              href={href}
              to={href}
            >
              {text}
            </Link>
          </Fragment>
        ))}
      </div>
    )
  }
)

export default Breadcrumb
