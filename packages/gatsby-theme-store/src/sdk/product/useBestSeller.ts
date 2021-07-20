interface SKU<T> {
  sellers: T[]
}

export const getBestSeller = <T>(sku: Maybe<SKU<T>>): T | undefined =>
  sku?.sellers?.[0]

// TODO: This could be sent to the backend since only marketplaces
// require this feature
export const useBestSeller = getBestSeller
