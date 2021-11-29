import React, { forwardRef } from 'react'
import type { FC, ReactNode } from 'react'

import type { IncentivesPureProps } from './IncentivesPure'
import IncentivesPure from './IncentivesPure'
import List from '../../atoms/List'

export interface IncentivesProps extends IncentivesPureProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

interface ListItemProps {
  testId: string
  children: ReactNode
}

const ListItem: FC<ListItemProps> = ({ children, ...otherProps }) => {
  if (React.isValidElement(children)) {
    return <li>{React.cloneElement(children, otherProps)}</li>
  }

  return <li>{children}</li>
}

const Incentives = forwardRef<HTMLDivElement, IncentivesProps>(
  function Incentives(
    { testId = 'store-incentives', children, ...otherProps },
    ref
  ) {
    return (
      <IncentivesPure ref={ref} testId={testId} {...otherProps}>
        <List data-list variant="unordered">
          {React.Children.map(children, (child, index) => (
            <ListItem key={`incentive-${index}`} testId={testId}>
              {child}
            </ListItem>
          ))}
        </List>
      </IncentivesPure>
    )
  }
)

export default Incentives
