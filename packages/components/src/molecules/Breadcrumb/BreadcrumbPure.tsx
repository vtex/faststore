import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'
import List from '../../atoms/List'
import ListItem from './ListItem'

export interface BreadcrumbPureProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A ReactNode that will be rendered as the Divider icon.
   */
  divider?: ReactNode
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const BreadcrumbPure = forwardRef<HTMLDivElement, BreadcrumbPureProps>(
  function BreadcrumbPure(
    {
      children,
      divider: rawDivider = '',
      testId = 'fs-breadcrumb',
      ...otherProps
    },
    ref
  ) {
    return (
      <nav
        aria-label="Breadcrumb"
        role="navigation"
        ref={ref}
        data-fs-breadcrumb
        data-testid={testId}
        {...otherProps}
      >
        <List as="ol" data-fs-breadcrumb-list data-fs-content="breadcrumb">
          {React.Children.toArray(children).map(
            (child, index, childrenArray) => {
              const isLastItem = index === childrenArray.length - 1

              return (
                <ListItem
                  isLastItem={isLastItem}
                  divider={rawDivider}
                  key={`breadcrumb-${index}`}
                  testId={testId}
                >
                  {child}
                </ListItem>
              )
            }
          )}
        </List>
      </nav>
    )
  }
)

export default BreadcrumbPure
