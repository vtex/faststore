import React, { forwardRef, Fragment } from 'react'
import type { FC, HTMLAttributes, ReactNode } from 'react'

import List from '../../atoms/List'

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

export type RatingItemProps = {
  children?: ReactNode
  'data-store-aggregate-rating-item'?: 'full' | 'half' | 'empty'
  'data-testid'?: string
}

const RatingItem: FC<RatingItemProps> = ({ children, ...otherProps }) => {
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
        return 'half'
      }

      return 'empty'
    }

    return (
      <List
        data-store-aggregate-rating
        variant="unordered"
        ref={ref}
        data-testid={testId}
        {...otherProps}
      >
        {React.Children.map(children, (child, index: number) => {
          const currentItemNumber = index + 1
          const fill = fillCheck(value - currentItemNumber)

          return (
            <Fragment key={`aggregate-rating-${index}`}>
              <RatingItem
                data-store-aggregate-rating-item={fill}
                data-testid={`${testId}-item`}
              >
                {child}
              </RatingItem>
            </Fragment>
          )
        })}
      </List>
    )
  }
)

export default AggregateRating
