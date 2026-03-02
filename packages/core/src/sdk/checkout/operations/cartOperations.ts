/**
 * GraphQL operations for the FastCheckout BFF cart.
 * These are raw query strings (not persisted queries) sent through the BFF proxy.
 */

// --- Shared fragments ---

const PRICE_VALUE_FIELDS = `
  asCurrency
  asNumber
`

const PRODUCT_PRICE_FRAGMENT = `
  ... on Price {
    __typename
    total
    value { ${PRICE_VALUE_FIELDS} }
  }
  ... on PriceWithDiscount {
    __typename
    total
    originalValue
    value { ${PRICE_VALUE_FIELDS} }
    valueWithDiscount { ${PRICE_VALUE_FIELDS} }
  }
`

const PRODUCT_FIELDS = `
  id
  itemId
  productId
  name
  skuName
  imageUrl
  quantity
  originalIndex
  productUrl
  brandName
  seller { id name }
  price { ${PRODUCT_PRICE_FRAGMENT} }
`

const UNAVAILABLE_PRODUCT_FIELDS = `
  id
  itemId
  productId
  name
  skuName
  imageUrl
  originalIndex
  productUrl
`

const CART_UNION_FRAGMENT = `
  ... on Cart {
    __typename
    id
    total
    totalItems
    availableItems { ${PRODUCT_FIELDS} }
    unavailableItems { ${UNAVAILABLE_PRODUCT_FIELDS} }
  }
  ... on EmptyCart {
    __typename
    id
  }
`

const SUMMARY_FIELDS = `
  id
  total { ${PRICE_VALUE_FIELDS} }
  totalizers {
    items
    discounts
    shipping {
      ... on ShippingTotalizer {
        __typename
        value
        value_v2 { ${PRICE_VALUE_FIELDS} }
      }
      ... on FreeShippingTotalizer {
        __typename
      }
      ... on ToBeCalculatedShippingTotalizer {
        __typename
      }
    }
  }
`

const COUPON_UNION_FRAGMENT = `
  ... on Coupon {
    __typename
    id
    promoCodes { value isUnmatchedCondition }
  }
  ... on EmptyCoupon {
    __typename
  }
`

const DELIVERY_UNION_FRAGMENT = `
  ... on Delivery {
    __typename
    id
    address {
      city
      state
      postalCode
      street
      number
      neighborhood
    }
    selected {
      ... on SingleSlaDelivery {
        __typename
        id
        name
        total { ${PRICE_VALUE_FIELDS} }
        estimateDate { day month weekDay inBusinessDays inHours }
      }
    }
    options {
      ... on SingleSlaDelivery {
        __typename
        id
        name
        total { ${PRICE_VALUE_FIELDS} }
        estimateDate { day month weekDay inBusinessDays inHours }
      }
    }
  }
  ... on EmptyDelivery {
    __typename
    id
  }
  ... on NoSlasDelivery {
    __typename
    id
    address {
      city
      state
      postalCode
      street
      number
      neighborhood
    }
  }
  ... on PreviewDelivery {
    __typename
    id
    address {
      city
      state
      postalCode
      street
      number
      neighborhood
    }
    bestOptions {
      id
      name
      total { ${PRICE_VALUE_FIELDS} }
      estimateDate { day month weekDay inBusinessDays inHours }
    }
  }
`

// --- Queries ---

export const CART_PAGE_QUERY = `
  query CartPageQuery {
    cart {
      ${CART_UNION_FRAGMENT}
    }
    summary {
      ${SUMMARY_FIELDS}
    }
    shipping {
      id
      delivery {
        ${DELIVERY_UNION_FRAGMENT}
      }
    }
    storePreferences {
      id
      currency
      country
    }
    coupon {
      ${COUPON_UNION_FRAGMENT}
    }
  }
`

// --- Mutations ---

export const CHANGE_PRODUCT_QUANTITY_MUTATION = `
  mutation ChangeProductQuantity($itemIndex: Int!, $quantity: Int!, $userIsoDate: String!) {
    changeProductQuantity(itemIndex: $itemIndex, quantity: $quantity, userIsoDate: $userIsoDate) {
      cart { ${CART_UNION_FRAGMENT} }
      summary { ${SUMMARY_FIELDS} }
    }
  }
`

export const REMOVE_PRODUCT_MUTATION = `
  mutation RemoveProduct($input: RemoveProductInput!) {
    removeProduct(input: $input) {
      cart { ${CART_UNION_FRAGMENT} }
      summary { ${SUMMARY_FIELDS} }
    }
  }
`

export const REMOVE_PRODUCTS_MUTATION = `
  mutation RemoveProducts($input: RemoveProductsInput!) {
    removeProducts(input: $input) {
      cart { ${CART_UNION_FRAGMENT} }
      summary { ${SUMMARY_FIELDS} }
    }
  }
`

export const ADD_PROMO_CODE_MUTATION = `
  mutation AddPromoCode($input: AddPromoCodeInput!) {
    addPromoCode(input: $input) {
      cart { ${CART_UNION_FRAGMENT} }
      summary { ${SUMMARY_FIELDS} }
      coupon { ${COUPON_UNION_FRAGMENT} }
    }
  }
`

export const REMOVE_PROMO_CODE_MUTATION = `
  mutation RemovePromoCode($promoCode: String!, $promoCodes: [String!]!) {
    removePromoCode(promoCode: $promoCode, promoCodes: $promoCodes) {
      cart { ${CART_UNION_FRAGMENT} }
      summary { ${SUMMARY_FIELDS} }
      coupon { ${COUPON_UNION_FRAGMENT} }
    }
  }
`

const SHIPPING_V2_FIELDS = `
  id
  delivery {
    ${DELIVERY_UNION_FRAGMENT}
  }
`

// SelectAddressPayload.errors is [CheckoutAPIError!]! (concrete type)
const CHECKOUT_API_ERROR_FIELDS = `
  __typename
  code
  message
  operationId
`

// UpdateDeliveryAddressPayload.errors is [UpdateDeliveryAddressError!]! (union)
// Both CheckoutAPIError and MissingZipcodeOrGeoCoords implement CheckoutPayloadError
const UPDATE_DELIVERY_ERROR_FRAGMENT = `
  ... on CheckoutPayloadError {
    __typename
    code
    message
    operationId
  }
`

export const ADDRESS_SUGGESTION_QUERY = `
  query AddressSuggestion($searchAddress: String!) {
    addressSuggestion(searchAddress: $searchAddress) {
      ... on AddressSuggestionList {
        __typename
        suggestions {
          addressQuery
          placeId
        }
      }
      ... on CompleteAddressSuggestionList {
        __typename
        suggestions {
          addressQuery
          city
          state
          street
          zipCode
        }
      }
      ... on EmptyAddressSuggestion {
        __typename
      }
    }
  }
`

export const UPDATE_ADDRESS_MUTATION = `
  mutation UpdateAddress($input: UpdateAddressInput!, $userIsoDate: String!) {
    updateAddress(input: $input, userIsoDate: $userIsoDate) {
      cart { ${CART_UNION_FRAGMENT} }
      summary { ${SUMMARY_FIELDS} }
      shipping_v2 { ${SHIPPING_V2_FIELDS} }
      errors { ${CHECKOUT_API_ERROR_FIELDS} }
    }
  }
`

export const FIND_ADDRESS_AND_UPDATE_MUTATION = `
  mutation FindAddressAndUpdate($input: FindAddressDetailsAndUpdateAddressInput!, $userIsoDate: String!) {
    findAddressDetailsAndUpdateAddress(input: $input, userIsoDate: $userIsoDate) {
      cart { ${CART_UNION_FRAGMENT} }
      summary { ${SUMMARY_FIELDS} }
      shipping_v2 { ${SHIPPING_V2_FIELDS} }
      errors { ${UPDATE_DELIVERY_ERROR_FRAGMENT} }
    }
  }
`

// --- Types ---

export interface BffPriceValue {
  asCurrency: string
  asNumber: number
}

export interface BffPrice {
  __typename: 'Price'
  total: string
  value: BffPriceValue
}

export interface BffPriceWithDiscount {
  __typename: 'PriceWithDiscount'
  total: string
  originalValue: string
  value: BffPriceValue
  valueWithDiscount: BffPriceValue
}

export type BffProductPrice = BffPrice | BffPriceWithDiscount

export interface BffProductSeller {
  id: string
  name: string
}

export interface BffProduct {
  id: string
  itemId: string
  productId: string
  name: string
  skuName: string
  imageUrl: string
  quantity: number
  originalIndex: number
  productUrl: string
  brandName: string | null
  seller: BffProductSeller
  price: BffProductPrice
}

export interface BffUnavailableProduct {
  id: string
  itemId: string
  productId: string
  name: string
  skuName: string
  imageUrl: string
  originalIndex: number
  productUrl: string
}

export interface BffCart {
  __typename: 'Cart'
  id: string
  total: string
  totalItems: number
  availableItems: BffProduct[]
  unavailableItems: BffUnavailableProduct[]
}

export interface BffEmptyCart {
  __typename: 'EmptyCart'
  id: string
}

export type BffCartUnion = BffCart | BffEmptyCart

export interface BffSummaryTotalizers {
  items: string | null
  discounts: string | null
  shipping:
    | {
        __typename: 'ShippingTotalizer'
        value: string
        value_v2: BffPriceValue
      }
    | { __typename: 'FreeShippingTotalizer' }
    | { __typename: 'ToBeCalculatedShippingTotalizer' }
}

export interface BffSummary {
  id: string
  total: BffPriceValue
  totalizers: BffSummaryTotalizers
}

export interface BffPromoCode {
  value: string
  isUnmatchedCondition: boolean
}

export interface BffCoupon {
  __typename: 'Coupon'
  id: string
  promoCodes: BffPromoCode[]
}

export interface BffEmptyCoupon {
  __typename: 'EmptyCoupon'
}

export type BffCouponUnion = BffCoupon | BffEmptyCoupon

export interface BffEstimateDate {
  day: number
  month: string
  weekDay: string
  inBusinessDays: number
  inHours: number
}

export interface BffSingleSlaDelivery {
  __typename: 'SingleSlaDelivery'
  id: string
  name: string
  total: BffPriceValue
  estimateDate: BffEstimateDate
}

export interface BffShippingAddress {
  city: string | null
  state: string | null
  postalCode: string | null
  street: string | null
  number: string | null
  neighborhood: string | null
}

export interface BffDelivery {
  __typename: 'Delivery'
  id: string
  address: BffShippingAddress
  selected: BffSingleSlaDelivery
  options: BffSingleSlaDelivery[]
}

export interface BffEmptyDelivery {
  __typename: 'EmptyDelivery'
  id: string
}

export interface BffNoSlasDelivery {
  __typename: 'NoSlasDelivery'
  id: string
  address: BffShippingAddress
}

export interface BffPreviewDelivery {
  __typename: 'PreviewDelivery'
  id: string
  address: BffShippingAddress
  bestOptions: BffSingleSlaDelivery
}

export type BffDeliveryUnion =
  | BffDelivery
  | BffEmptyDelivery
  | BffNoSlasDelivery
  | BffPreviewDelivery

export interface BffShipping {
  id: string
  delivery: BffDeliveryUnion
}

export interface BffStorePreferences {
  id: string
  currency: string
  country: string
}

export interface CartPageData {
  cart: BffCartUnion
  summary: BffSummary
  shipping: BffShipping
  storePreferences: BffStorePreferences
  coupon: BffCouponUnion
}

export interface MutationPayload {
  cart: BffCartUnion | null
  summary: BffSummary | null
}

export interface PromoCodeMutationPayload extends MutationPayload {
  coupon: BffCouponUnion | null
}

// --- Address Suggestion Types ---

export interface GoogleAddressSuggestion {
  addressQuery: string
  placeId: string
}

export interface CompleteAddressSuggestion {
  addressQuery: string
  city: string
  state: string
  street: string
  zipCode: string
}

export interface AddressSuggestionList {
  __typename: 'AddressSuggestionList'
  suggestions: GoogleAddressSuggestion[]
}

export interface CompleteAddressSuggestionList {
  __typename: 'CompleteAddressSuggestionList'
  suggestions: CompleteAddressSuggestion[]
}

export interface EmptyAddressSuggestion {
  __typename: 'EmptyAddressSuggestion'
}

export type AddressSuggestionUnion =
  | AddressSuggestionList
  | CompleteAddressSuggestionList
  | EmptyAddressSuggestion

export interface AddressSuggestionData {
  addressSuggestion: AddressSuggestionUnion
}

export interface AddressMutationError {
  __typename: string
  code: string
  message: string
  operationId: string
}

export interface AddressMutationPayload {
  cart: BffCartUnion | null
  summary: BffSummary | null
  shipping_v2: BffShipping | null
  errors: AddressMutationError[]
}
