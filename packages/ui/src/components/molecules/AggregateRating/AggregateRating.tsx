import React, { forwardRef } from 'react'
import type { FC, PropsWithChildren, HTMLAttributes } from 'react'

import { List } from '@faststore/components'

export interface AggregateRatingProps extends HTMLAttributes<HTMLUListElement> {
  /**
   * The current value of the rating, based on the quantity of child elements.
   */
  value: number
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export interface RatingItemProps {
  'data-fs-aggregate-rating-item'?: 'full' | 'partial' | 'empty'
  'data-testid'?: string
}

const RatingItem: FC<PropsWithChildren<RatingItemProps>> = ({
  children,
  ...otherProps
}) => {
  if (!React.isValidElement(children)) {
    return <li {...otherProps}>{children}</li>
  }

  return <li>{React.cloneElement(children, otherProps)}</li>
}

const AggregateRating = forwardRef<HTMLUListElement, AggregateRatingProps>(
  function AggregateRating(
    { children, testId = 'store-aggregate-rating', value, ...otherProps },
    ref
  ) {
    const fillCheck = (itemValue: number) => {
      if (itemValue >= 1) {
        return 'full'
      }

      if (0 < itemValue && itemValue < 1) {
        return 'partial'
      }

      return 'empty'
    }

    return (
      <List
        data-fs-aggregate-rating
        ref={ref}
        data-testid={testId}
        {...otherProps}
      >
        {React.Children.map(children, (child, index: number) => {
          const currentItemNumber = index
          const fill = fillCheck(value - currentItemNumber)

          return (
            <RatingItem
              key={`aggregate-rating-${index}`}
              data-fs-aggregate-rating-item={fill}
              data-testid={`${testId}-item`}
            >
              {child}
            </RatingItem>
          )
        })}
      </List>
    )
  }
)

export default AggregateRating
