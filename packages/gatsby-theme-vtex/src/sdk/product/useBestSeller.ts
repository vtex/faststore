import { ArrayItem, Maybe } from '../../typings'

interface Seller {
  commertialOffer: {
    AvailableQuantity: number
    Price: number
  }
}

interface SKU {
  sellers: Seller[]
}

// TODO: This could be sent to the backend since only marketplaces
// require this feature
export const useBestSeller = <T extends SKU>(sku: Maybe<T>) =>
  sku?.sellers[0] as ArrayItem<T['sellers']>

// The logic bellow is how it was originally implemented. We should
// move this logic to the backend
// useMemo(() => {
//   let bestSeller = sku?.sellers?.[0]

//   if (!bestSeller) {
//     return
//   }

//   for (const seller of sku!.sellers!) {
//     const { commertialOffer } = seller!

//     if (
//       commertialOffer!.AvailableQuantity! > 0 &&
//       commertialOffer!.Price! < bestSeller!.commertialOffer!.Price!
//     ) {
//       bestSeller = seller
//     }
//   }

//   return bestSeller as ArrayItem<T['sellers']>
// }, [sku])
