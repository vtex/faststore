import React, { forwardRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { HTMLAttributes } from 'react'

import List from '../../atoms/List'
import { Icon, IconButton } from '../..'

export interface RatingProps extends Omit<HTMLAttributes<HTMLUListElement>, "onChange"> {
  /**
   * The length of child elements.
   */
  length?: number
  /**
   * The current value of the rating, based on the quantity of child elements.
   */
  value: number
  /**
   * A React component that will be rendered as an icon.
   */
  icon: ReactNode
  /**
   * Specifies that this input should be controled by the user.
   */
  actionable?: boolean
  /**
   * description
   */
  onChange?: (value: number) => void
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export interface RatingItemProps {
  'data-fs-rating-item'?: 'full' | 'partial' | 'empty'
  'data-testid'?: string
}

const Rating = forwardRef<HTMLUListElement, RatingProps>(
  function Rating(
    { children, testId = 'fs-rating', length = 5, value, actionable, icon, onChange, ...otherProps },
    ref
  ) {
    const [hover, setHover] = useState(0)

    return (
      <List
        ref={ref}
        data-fs-rating
        data-fs-rating-actionable={typeof onChange === "function"}
        data-testid={testId}
        {...otherProps}
      >
        {Array.from({ length }).map((_, index: number) => {
          const fillCheck = (itemValue: number) => {
            if (index <= (hover || value)) {
              return 'full'
            }
            if (0 < itemValue && itemValue < 1) {
              return 'partial'
            }
            return 'empty'
          }

          const fill = fillCheck(value - index)

          return (
             <li
              key={`rating-${index}`}
              data-fs-rating-item={fill}
              data-testid={`${testId}-item`}
            >
              {onChange ? (
                <IconButton
                  data-fs-rating-button
                  icon={icon}
                  size="small"
                  aria-label="rate"
                  onClick={() => {onChange(index)}}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(value)}
                />
              ) : (
                <>
                  <div data-fs-rating-icon-wrapper>
                    <Icon component={icon} />
                  </div>
                  <Icon data-fs-rating-icon-border component={icon} />
                </>
              )}
            </li>
          )
        })}
      </List>
    )
  }
)

export default Rating
