import React from 'react'
import { Badge, BadgeProps } from '../..'

import { useDiscountPercent } from '../DiscountBadge/useDiscountPercent'

export interface DiscountBadgeProps
  extends Omit<BadgeProps, 'variant' | 'counter' | 'aria-label'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies price without discount applied.
   */
  listPrice: number
  /**
   * Specifies current price with discount applied.
   */
  spotPrice: number
  /**
   * Sets the limit percentage value to consider a low discount.
   */
  thresholdLow?: number
  /**
   * Sets the limit percentage value to consider a high discount.
   */
  thresholdHigh?: number
}

const DiscountBadge = ({
  listPrice,
  spotPrice,
  thresholdLow = 15,
  thresholdHigh = 40,
  size,
  testId = 'fs-discount-badge',
}: DiscountBadgeProps) => {
  const discountPercent = useDiscountPercent(listPrice, spotPrice)

  if (discountPercent === 0) {
    return <></>
  }

  const discountVariant =
    discountPercent <= thresholdLow
      ? 'low'
      : discountPercent <= thresholdHigh
      ? 'medium'
      : 'high'

  return (
    <Badge
      data-fs-discount-badge
      data-fs-discount-badge-variant={discountVariant}
      size={size}
      data-testid={testId}
    >
      {discountPercent}% off
    </Badge>
  )
}

export default DiscountBadge
