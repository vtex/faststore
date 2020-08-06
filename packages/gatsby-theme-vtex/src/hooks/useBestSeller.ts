import { useMemo } from 'react'

type ArrayItem<A> = A extends ReadonlyArray<infer T> ? T : never

type Sku = {
  sellers: Array<{
    commertialOffer: {
      AvailableQuantity: number
      Price: number
    }
  }>
}

// TODO: This could be sent to the backend since only marketplaces
// require this feature
export const useBestSeller = <T extends Sku>(sku?: T) =>
  useMemo(() => {
    let bestSeller = sku?.sellers?.[0]

    if (!bestSeller) {
      return
    }

    for (const seller of sku!.sellers!) {
      const { commertialOffer } = seller!

      if (
        commertialOffer!.AvailableQuantity! > 0 &&
        commertialOffer!.Price! < bestSeller!.commertialOffer!.Price!
      ) {
        bestSeller = seller
      }
    }

    return bestSeller as ArrayItem<T['sellers']>
  }, [sku])
