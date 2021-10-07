import type {
  AllHTMLAttributes,
  AnchorHTMLAttributes,
  FC,
  ReactNode,
} from 'react'
import React, { forwardRef } from 'react'

export type BreadcrumbLevel = {
  href: string
  text: string
}

export interface BreadcrumbProps<T = HTMLDivElement>
  extends AllHTMLAttributes<T> {
  /**
   * Array with each level of the breadcrumb, containing link and text.
   */
  breadcrumb: BreadcrumbLevel[]
  /**
   * A React component that will be rendered as the Divider icon.
   */
  DividerIcon?: ReactNode
  /**
   * A React component that will be rendered as the Home icon.
   */
  HomeIcon?: ReactNode
  /**
   * Custom Link component when using custom routing.
   */
  LinkComponent?: FC<{ href?: string; to?: string; 'data-testid': string }>
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const DefaultLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a {...props}>{props.children}</a>
)

const DefaultHomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
  </svg>
)

const DefaultDividerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 180 180"
    style={{
      boxSizing: 'border-box',
      fill: 'rgb(230, 230, 230)',
      display: 'flex',
    }}
  >
    <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
  </svg>
)

const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  function Breadcrumb(
    {
      breadcrumb,
      children,
      HomeIcon = <DefaultHomeIcon />,
      DividerIcon = <DefaultDividerIcon />,
      LinkComponent = DefaultLink,
      testId = 'store-breadcrumb',
      ...props
    },
    ref
  ) {
    return (
      <div ref={ref} data-store-breadcrumb data-testid={testId} {...props}>
        <LinkComponent
          data-testid={`${testId}-home`}
          data-store-breadcrumb-home
          href="/"
          to="/"
        >
          {HomeIcon}
        </LinkComponent>
        {breadcrumb.map(({ href, text }, index) => (
          <>
            {DividerIcon}
            <LinkComponent
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
            </LinkComponent>
          </>
        ))}
      </div>
    )
  }
)

export default Breadcrumb
