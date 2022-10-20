import { memo } from 'react'

import { useDiscountPercent } from 'src/sdk/product/useDiscountPercent'

import Badge from './Badge'

export type DiscountBadgeProps = {
  /**
   * Specifies price without discount applied.
   */
  listPrice: number
  /**
   * Specifies current price with discount applied.
   */
  spotPrice: number
  /**
   * Sets the component size as big.
   */
  big?: boolean
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
  big = false,
  thresholdLow = 15,
  thresholdHigh = 40,
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
    <Badge big={big} data-fs-discount-badge-variant={discountVariant}>
      {discountPercent}% off
    </Badge>
  )
}

export default memo(DiscountBadge)
