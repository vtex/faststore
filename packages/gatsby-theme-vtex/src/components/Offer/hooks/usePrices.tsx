import { useMemo } from 'react'

import { useNumberFormat } from '../../../providers/NumberFormat'
import { SyncProductCommertialOffer } from '../../../types/product'

export const usePrices = (offer: SyncProductCommertialOffer) => {
  const numberFormat = useNumberFormat()

  const formattedListPrice = useMemo(
    () =>
      (offer?.ListPrice &&
        offer?.Price !== offer?.ListPrice &&
        numberFormat.format(offer?.ListPrice)) ||
      undefined,
    [offer, numberFormat]
  )

  const formattedSellingPrice = useMemo(
    () => (offer ? numberFormat.format(offer.Price) : undefined),
    [offer, numberFormat]
  )

  const discount = useMemo(() => {
    if (!offer?.ListPrice || !offer?.Price) return
    const relation = Math.round((offer.Price / offer.ListPrice) * 100)

    return 100 - relation
  }, [offer])

  return {
    formattedSellingPrice,
    formattedListPrice,
    discount,
  }
}
