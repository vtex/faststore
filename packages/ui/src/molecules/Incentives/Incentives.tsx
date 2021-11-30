import React, { forwardRef } from 'react'
import type { FC, ReactNode, AriaAttributes } from 'react'

import type { IncentivesPureProps } from './IncentivesPure'
import IncentivesPure from './IncentivesPure'
import List from '../../atoms/List'

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

export interface IncentivesProps extends IncentivesPureProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Defines a string value that labels the current element.
   */
  'aria-label'?: AriaAttributes['aria-label']
}

const Incentives = forwardRef<HTMLDivElement, IncentivesProps>(
  function Incentives(
    {
      testId = 'store-incentives',
      'aria-label': ariaLabel = 'Incentives',
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <IncentivesPure
        ref={ref}
        testId={testId}
        aria-label={ariaLabel}
        {...otherProps}
      >
        <List data-incentives-list role="list" variant="unordered">
          {React.Children.map(children, (child, index) => (
            <ListItem key={`incentive-${index}`} testId={`${testId}-item`}>
              {child}
            </ListItem>
          ))}
        </List>
      </IncentivesPure>
    )
  }
)

export default Incentives
