// Types matching the FastCheckout BFF GraphQL schema.
// Price can be either a flat price or a price with a discount applied.

export interface FCPriceValue {
  asCurrency: string
  asNumber: number
}

export interface FCPrice {
  __typename: 'Price'
  total: string
  value: FCPriceValue
}

export interface FCPriceWithDiscount {
  __typename: 'PriceWithDiscount'
  total: string
  value: FCPriceValue
  originalValue: string
  valueWithDiscount: FCPriceValue
}

export type FCProductPrice = FCPrice | FCPriceWithDiscount

export interface FCCartProduct {
  id: string
  name: string
  skuName: string
  imageUrl: string
  quantity: number
  price: FCProductPrice
  itemValue: FCProductPrice
  originalIndex: number
  seller: { id: string; name: string }
  productId: string
  itemId: string
  brandName: string | null
  productUrl: string
}

export interface FCCartUnavailableProduct {
  id: string
  name: string
  skuName: string
  imageUrl: string
  quantity: number
  price: FCProductPrice | null
  originalIndex: number
  productUrl: string
}

export interface FCSummaryTotalizers {
  items: string | null
  discounts: string | null
}

export interface FCSummary {
  id: string
  total: FCPriceValue
  totalizers: FCSummaryTotalizers
}

export interface FCCart {
  __typename: 'Cart'
  id: string
  total: string
  totalItems: number
  salesChannel: string
  availableItems: FCCartProduct[]
  unavailableItems: FCCartUnavailableProduct[]
}

export interface FCEmptyCart {
  __typename: 'EmptyCart'
  id: string
}

export type FCCartUnion = FCCart | FCEmptyCart

export function isNonEmptyCart(cart: FCCartUnion): cart is FCCart {
  return cart.__typename === 'Cart'
}

export function hasPriceDiscount(
  price: FCProductPrice
): price is FCPriceWithDiscount {
  return price.__typename === 'PriceWithDiscount'
}

export interface FCMutationError {
  message: string
  code?: string
}

export interface FCCartMutationPayload {
  cart: FCCartUnion | null
  summary: FCSummary | null
  errors: FCMutationError[]
}
