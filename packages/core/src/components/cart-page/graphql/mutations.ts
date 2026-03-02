import { ALL_FRAGMENTS } from './fragments'

const MUTATION_RESPONSE_FIELDS = `
  cart { ...CartFields }
  summary { ...SummaryFields }
  coupon { ...CouponFields }
  errors {
    __typename
    ... on CheckoutAPIError { message code operationId }
  }
`

const MUTATION_WITH_SHIPPING_FIELDS = `
  ${MUTATION_RESPONSE_FIELDS}
  shipping_v2 { ...ShippingFields }
`

export const CHANGE_PRODUCT_QUANTITY_MUTATION = `
  mutation ChangeProductQuantity($itemIndex: Int!, $quantity: Int!, $userIsoDate: String!) {
    changeProductQuantity(itemIndex: $itemIndex, quantity: $quantity, userIsoDate: $userIsoDate) {
      ${MUTATION_WITH_SHIPPING_FIELDS}
    }
  }
  ${ALL_FRAGMENTS}
`

export const REMOVE_PRODUCT_MUTATION = `
  mutation RemoveProduct($input: RemoveProductInput!) {
    removeProduct(input: $input) {
      ${MUTATION_WITH_SHIPPING_FIELDS}
    }
  }
  ${ALL_FRAGMENTS}
`

export const REMOVE_PRODUCTS_MUTATION = `
  mutation RemoveProducts($input: RemoveProductsInput!) {
    removeProducts(input: $input) {
      ${MUTATION_WITH_SHIPPING_FIELDS}
    }
  }
  ${ALL_FRAGMENTS}
`

export const REMOVE_ALL_PRODUCTS_MUTATION = `
  mutation RemoveAllProducts {
    removeAllProducts {
      cart { ...CartFields }
      summary { ...SummaryFields }
      coupon { ...CouponFields }
      errors {
        __typename
        ... on CheckoutAPIError { message code operationId }
      }
    }
  }
  ${ALL_FRAGMENTS}
`

export const ADD_PROMO_CODE_MUTATION = `
  mutation AddPromoCode($input: AddPromoCodeInput!) {
    addPromoCode(input: $input) {
      cart { ...CartFields }
      summary { ...SummaryFields }
      coupon { ...CouponFields }
      errors {
        __typename
        ... on InvalidPromoCodeError { message }
        ... on ExpiredPromoCodeError { message }
        ... on CheckoutAPIError { message code operationId }
      }
    }
  }
  ${ALL_FRAGMENTS}
`

export const REMOVE_PROMO_CODE_MUTATION = `
  mutation RemovePromoCode($promoCodes: [String!]!, $promoCode: String!) {
    removePromoCode(promoCodes: $promoCodes, promoCode: $promoCode) {
      coupon { ...CouponFields }
      cart { ...CartFields }
      summary { ...SummaryFields }
      errors {
        __typename
        ... on InvalidPromoCodeError { message }
        ... on ExpiredPromoCodeError { message }
        ... on CheckoutAPIError { message code operationId }
      }
    }
  }
  ${ALL_FRAGMENTS}
`

export const SELECT_DELIVERY_CHANNEL_MUTATION = `
  mutation SelectDeliveryChannel($input: SelectDeliveryChannelInput!) {
    selectDeliveryChannel(input: $input) {
      shipping_v2 { ...ShippingFields }
      cart { ...CartFields }
      summary { ...SummaryFields }
      errors {
        __typename
        ... on CheckoutAPIError { message code operationId }
      }
    }
  }
  ${ALL_FRAGMENTS}
`

export const SELECT_SINGLE_SLA_MUTATION = `
  mutation SelectSingleSla($input: SelectSingleSlaInput!) {
    selectSingleSla(input: $input) {
      shipping_v2 { ...ShippingFields }
      cart { ...CartFields }
      summary { ...SummaryFields }
      errors {
        __typename
        ... on CheckoutAPIError { message code operationId }
      }
    }
  }
  ${ALL_FRAGMENTS}
`

export const FIND_ADDRESS_AND_UPDATE_MUTATION = `
  mutation FindAddressDetailsAndUpdateAddress($input: FindAddressDetailsAndUpdateAddressInput!, $userIsoDate: String!) {
    findAddressDetailsAndUpdateAddress(input: $input, userIsoDate: $userIsoDate) {
      shipping_v2 { ...ShippingFields }
      cart { ...CartFields }
      summary { ...SummaryFields }
      errors {
        __typename
        ... on CheckoutAPIError { message code operationId }
      }
    }
  }
  ${ALL_FRAGMENTS}
`

export const ADD_PRODUCT_MUTATION = `
  mutation AddProduct($quantity: Int!, $id: String!, $seller: String!, $userIsoDate: String!) {
    addProduct(quantity: $quantity, id: $id, seller: $seller, userIsoDate: $userIsoDate) {
      ${MUTATION_WITH_SHIPPING_FIELDS}
    }
  }
  ${ALL_FRAGMENTS}
`
