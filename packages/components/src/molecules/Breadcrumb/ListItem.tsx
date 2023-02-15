import React, { ReactNode } from 'react'
import { BreadcrumbBaseProps } from './BreadcrumbBase'
import Divider from './Divider'

type ListItemProps = {
  children: ReactNode
  isLastItem: boolean
  divider: BreadcrumbBaseProps['divider']
  testId: string
}

const ListItem = ({ children, isLastItem, divider, testId }: ListItemProps) => {
  const props = {
    'data-testid': `${testId}-item`,
    'data-fs-breadcrumb-item': isLastItem ? 'current' : true,
    'aria-current': isLastItem ? ('page' as const) : undefined,
  }

  if (!React.isValidElement(children)) {
    return (
      <li data-fs-breadcrumb-list-item>
        <span {...props}>
          {children}
          {isLastItem ? null : <Divider divider={divider} testId={testId} />}
        </span>
      </li>
    )
  }

  return (
    <li data-fs-breadcrumb-list-item>
      {React.cloneElement(children, props)}
      {isLastItem ? null : <Divider divider={divider} testId={testId} />}
    </li>
  )
}

export default ListItem
