interface Seller {
  commercialOffer: {
    availableQuantity: number
    price: number
  }
}

interface SKU {
  sellers: Seller[]
}

// TODO: This could be sent to the backend since only marketplaces
// require this feature
export const useBestSeller = <T extends SKU>(sku: Maybe<T>) =>
  sku?.sellers?.[0] as ArrayItem<T['sellers']>
