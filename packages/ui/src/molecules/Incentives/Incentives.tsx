import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import type { IncentivesPureProps } from './IncentivesPure'
import IncentivesPure from './IncentivesPure'
import Icon from '../../atoms/Icon'
import List from '../../atoms/List'
import Label from '../../atoms/Label'

export interface IncentivesProps extends IncentivesPureProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  incentives: IncentivesType[]
}

interface IncentivesType {
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  title?: string
  description?: string
}

const Incentives = forwardRef<HTMLDivElement, IncentivesProps>(
  function Incentives(
    { testId = 'store-incentives', incentives, ...otherProps },
    ref
  ) {
    return (
      <IncentivesPure ref={ref} testId={testId} {...otherProps}>
        <List role="list">
          {incentives.map(({ icon, title, description }, index) => {
            return (
              <li key={`incentive-${index}`}>
                {icon && <Icon component={icon} />}
                {title && <Label data-store-incentive-label>{title}</Label>}
                <span>{description}</span>
              </li>
            )
          })}
        </List>
      </IncentivesPure>
    )
  }
)

export default Incentives
