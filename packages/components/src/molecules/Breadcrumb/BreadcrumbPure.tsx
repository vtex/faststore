import type { ComponentProps, ReactNode } from 'react'
import React from 'react'
import List from '../../atoms/List'
import ListItem from './ListItem'

export interface BreadcrumbPureProps extends ComponentProps<'div'> {
  /**
   * A ReactNode that will be rendered as the Divider icon.
   */
  divider?: ReactNode
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function BreadcrumbPure({
  children,
  divider: rawDivider = '',
  testId = 'fs-breadcrumb',
  ref,
  ...otherProps
}: BreadcrumbPureProps) {
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
        {React.Children.toArray(children).map((child, index, childrenArray) => {
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
        })}
      </List>
    </nav>
  )
}
