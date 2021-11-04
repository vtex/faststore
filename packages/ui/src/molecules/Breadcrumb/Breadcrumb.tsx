import React, { forwardRef, Fragment } from 'react'
import type { FC, HTMLAttributes, ReactNode } from 'react'

import List from '../../atoms/List'

export interface BreadcrumbProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A ReactNode that will be rendered as the Divider icon.
   */
  divider?: ReactNode
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Divider: FC<BreadcrumbProps> = ({ divider, testId }) => {
  const props = {
    'data-store-breadcrumb-divider': true,
    'aria-hidden': true,
    'data-testid': `${testId}-divider`,
  }

  if (React.isValidElement(divider)) {
    return React.cloneElement(divider, props)
  }

  return <span {...props}>{divider ?? '/'}</span>
}

type ListItemProps = {
  children: ReactNode
  isLastItem: boolean
  testId: string
}

const ListItem: FC<ListItemProps> = ({ children, isLastItem, testId }) => {
  const props = {
    'data-testid': `${testId}-item`,
    'data-store-breadcrumb-item': isLastItem ? 'current' : true,
    'aria-current': isLastItem ? ('page' as const) : undefined,
  }

  if (!React.isValidElement(children)) {
    return (
      <li>
        <span {...props}>{children}</span>
      </li>
    )
  }

  return <li>{React.cloneElement(children, props)}</li>
}

const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  function Breadcrumb(
    {
      children,
      divider: rawDivider,
      testId = 'store-breadcrumb',
      ...otherProps
    },
    ref
  ) {
    const lastIndex = React.Children.count(children)

    return (
      <nav
        aria-label="Breadcrumb"
        role="navigation"
        ref={ref}
        data-store-breadcrumb
        data-testid={testId}
        {...otherProps}
      >
        <List data-store-breadcrumb-list variant="ordered">
          {React.Children.map(children, (child, index) => {
            const isLastItem = index === lastIndex - 1

            return (
              <Fragment key={`breadcrumb-${index}`}>
                <ListItem isLastItem={isLastItem} testId={testId}>
                  {child}
                </ListItem>
                {isLastItem ? null : (
                  <Divider divider={rawDivider} testId={testId} />
                )}
              </Fragment>
            )
          })}
        </List>
      </nav>
    )
  }
)

export default Breadcrumb
