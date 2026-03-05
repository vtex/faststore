// FC BFF GraphQL response types

export interface FCSeller {
  id: string
  name: string
}

export interface FCPriceValue {
  asCurrency: string
  asNumber: number
}

export interface FCTag {
  id: string
  type: string
  value: string
}

export interface FCPriceBase {
  __typename: 'Price'
  total: string
  value: FCPriceValue
}

export interface FCPriceWithDiscount {
  __typename: 'PriceWithDiscount'
  originalValue: string
  total: string
  value: FCPriceValue
  valueWithDiscount: FCPriceValue
}

export type FCPrice = FCPriceBase | FCPriceWithDiscount

export function getSellingPrice(price: FCPrice): number {
  if (price.__typename === 'PriceWithDiscount') {
    return price.valueWithDiscount.asNumber
  }

  return price.value.asNumber
}

export function getListPrice(price: FCPrice): number {
  return price.value.asNumber
}

export type ItemAvailability =
  | 'available'
  | 'withoutStock'
  | 'cannotBeDelivered'
  | 'nullPrice'
  | 'withoutPrice'
  | 'withoutPriceRnB'
  | 'withoutPriceFulfillment'
  | 'itemMetricsNotFound'
  | 'unavailableItemCatalog'
  | 'itemQuantityNotAvailable'
  | 'maxNumberOfSellersReached'
  | 'unavailableItemFulfillment'
  | 'unavailableComposition'

export interface FCCompositionItem {
  id: string
  name: string
  quantity: number
  value: FCPrice | null
  itemValue: FCPrice | null
  availability: ItemAvailability
}

export interface FCCompositionGroup {
  id: string
  name: string
  items: FCCompositionItem[]
}

export interface FCCartItem {
  id: string
  itemId: string
  productId: string
  name: string
  imageUrl: string
  quantity: number
  originalIndex: number
  measurementUnit: string
  seller: FCSeller
  tags: FCTag[]
  price: FCPrice
  compositions: FCCompositionGroup[]
  compositionCount: number
}

export type UnavailabilityType =
  | 'ProductUnavailable'
  | 'ProductOutOfStock'
  | 'ProductWithoutDelivery'
  | 'ProductUnavailableForPickup'

export interface FCUnavailableItem {
  __typename: UnavailabilityType
  id: string
  itemId: string
  productId: string
  name: string
  imageUrl: string
  quantity: number
  originalIndex: number
  price: FCPrice | null
  compositions: FCCompositionGroup[]
  compositionCount: number
}

export interface FCCart {
  __typename: 'Cart'
  id: string
  total: string
  totalItems: number
  salesChannel: string
  availableItems: FCCartItem[]
  unavailableItems: FCUnavailableItem[]
}

export interface FCEmptyCart {
  __typename: 'EmptyCart'
  id: string
}

export type CartUnion = FCCart | FCEmptyCart

export interface MutationError {
  message: string
}

export interface CartMutationResponse {
  cart: CartUnion
  errors: MutationError[] | null
}

// Adapter display types for Discovery UI mapping

export interface CompositionItemDisplay {
  name: string
  quantity: number
  /** Price in currency units (cents / 100) */
  price: number
  isAvailable: boolean
}

export interface CompositionDisplayData {
  groupName: string
  items: CompositionItemDisplay[]
}

export interface CartItemDisplayData {
  id: string
  itemIndex: number
  itemId: string
  productId: string
  name: string
  imageUrl: string
  imageAlt: string
  quantity: number
  /** Selling price in currency units */
  sellingPrice: number
  /** List price in currency units */
  listPrice: number
  hasDiscount: boolean
  discountPercentage: number | null
  sellerName: string
  sellerId: string
  tags: string[]
  compositions: CompositionDisplayData[]
  hasCompositions: boolean
  measurementUnit: string
}

export type ItemMutationState =
  | 'idle'
  | 'updating'
  | 'removing'
  | 'readding'
  | 'error'

export const UNAVAILABILITY_BADGES: Record<UnavailabilityType, string> = {
  ProductOutOfStock: 'Out of Stock',
  ProductWithoutDelivery: 'Unavailable for Delivery',
  ProductUnavailableForPickup: 'Unavailable for Pickup',
  ProductUnavailable: 'Unavailable',
}

// Adapters

function getCompositionItemPrice(price: FCPrice | null): number {
  if (!price) return 0

  return getSellingPrice(price)
}

export function adaptCartItem(item: FCCartItem): CartItemDisplayData {
  const sellingPrice = getSellingPrice(item.price)
  const listPrice = getListPrice(item.price)

  return {
    id: item.id,
    itemIndex: item.originalIndex,
    itemId: item.itemId,
    productId: item.productId,
    name: item.name,
    imageUrl: item.imageUrl,
    imageAlt: item.name,
    quantity: item.quantity,
    sellingPrice,
    listPrice,
    hasDiscount: item.price.__typename === 'PriceWithDiscount',
    discountPercentage: null,
    sellerName: item.seller.name,
    sellerId: item.seller.id,
    tags: item.tags.map((t) => t.value),
    compositions: item.compositions
      .filter((g) => g.items.length > 0)
      .map((g) => ({
        groupName: g.name,
        items: g.items.map((ci) => ({
          name: ci.name,
          quantity: ci.quantity,
          price: getCompositionItemPrice(ci.value),
          isAvailable: ci.availability === 'available',
        })),
      })),
    hasCompositions: item.compositions.some((g) => g.items.length > 0),
    measurementUnit: item.measurementUnit,
  }
}
