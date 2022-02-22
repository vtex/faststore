import React, { forwardRef } from 'react'
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
    'data-breadcrumb-divider': true,
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
  divider: BreadcrumbProps['divider']
  testId: string
}

const ListItem: FC<ListItemProps> = ({
  children,
  isLastItem,
  divider,
  testId,
}) => {
  const props = {
    'data-testid': `${testId}-item`,
    'data-breadcrumb-item': isLastItem ? 'current' : true,
    'aria-current': isLastItem ? ('page' as const) : undefined,
  }

  if (!React.isValidElement(children)) {
    return (
      <li data-breadcrumb-list-item>
        <span {...props}>
          {children}
          {isLastItem ? null : <Divider divider={divider} testId={testId} />}
        </span>
      </li>
    )
  }

  return (
    <li data-breadcrumb-list-item>
      {React.cloneElement(children, props)}
      {isLastItem ? null : <Divider divider={divider} testId={testId} />}
    </li>
  )
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
        <List data-breadcrumb-list variant="ordered">
          {React.Children.map(children, (child, index) => {
            const isLastItem = index === lastIndex - 1

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
)

export default Breadcrumb
