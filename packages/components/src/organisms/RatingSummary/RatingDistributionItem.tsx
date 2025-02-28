import React, { forwardRef, type HTMLAttributes } from 'react'
import Icon from '../../atoms/Icon'

export interface RatingDistributionItemProps
  extends HTMLAttributes<HTMLLIElement> {
  /**
   * Star rating index. It should be a number between 1 and 5.
   */
  ratingIndex: number
  /**
   * Percentage value. It should be a number between 0 and 100.
   */
  value: number
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ItemStar = ({ ratingIndex }: { ratingIndex: number }) => (
  <span data-fs-rating-distribution-item-star>
    {ratingIndex}
    <Icon data-fs-rating-distribution-item-star-icon name="Star" />
  </span>
)

const ItemBar = ({ value }: { value: number }) => (
  <div data-fs-rating-distribution-item-bar>
    <div data-fs-rating-distribution-item-bar-track>
      <div
        data-fs-rating-distribution-item-bar-fill
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
)

const ItemPercentage = ({ percentage }: { percentage: number }) => (
  <p data-fs-rating-distribution-item-percentage>{percentage}%</p>
)

const RatingDistributionItem = forwardRef<
  HTMLLIElement,
  RatingDistributionItemProps
>(function RatingDistributionItem(
  { ratingIndex, value, testId = 'fs-rating-distribution-item' },
  ref
) {
  return (
    <li ref={ref} data-fs-distribution-item data-testid={testId}>
      <ItemStar ratingIndex={ratingIndex} />
      <ItemBar value={value} />
      <ItemPercentage percentage={value} />
    </li>
  )
})
export default RatingDistributionItem
