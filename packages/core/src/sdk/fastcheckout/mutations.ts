import { CART_ITEM_FIELDS, UNAVAILABLE_ITEM_FIELDS } from './queries'

const CART_FIELDS = `
  cart {
    ... on Cart {
      __typename
      id
      total
      totalItems
      availableItems {
        ...CartItemFields
      }
      unavailableItems {
        ... on ProductUnavailable {
          __typename
          ...UnavailableItemFields
        }
        ... on ProductOutOfStock {
          __typename
          ...UnavailableItemFields
        }
        ... on ProductWithoutDelivery {
          __typename
          ...UnavailableItemFields
        }
        ... on ProductUnavailableForPickup {
          __typename
          ...UnavailableItemFields
        }
      }
    }
    ... on EmptyCart {
      __typename
      id
    }
  }
`

const CHANGE_QUANTITY_ERRORS = `
  errors {
    ... on CheckoutAPIError { message }
    ... on ItemMaxQuantityLimitReachedError { message }
    ... on ItemQuantityNotAvailableError { message }
  }
`

const CHECKOUT_ERRORS = `
  errors {
    ... on CheckoutAPIError { message }
    ... on InvalidIndexError { message }
  }
`

const ADD_PRODUCT_ERRORS = `
  errors {
    ... on CheckoutAPIError { message }
  }
`

export const CHANGE_PRODUCT_QUANTITY = `
  mutation ChangeProductQuantity($itemIndex: Int!, $quantity: Int!, $userIsoDate: String!) {
    changeProductQuantity(itemIndex: $itemIndex, quantity: $quantity, userIsoDate: $userIsoDate) {
      ${CART_FIELDS}
      ${CHANGE_QUANTITY_ERRORS}
    }
  }
  ${CART_ITEM_FIELDS}
  ${UNAVAILABLE_ITEM_FIELDS}
`

export const REMOVE_PRODUCT = `
  mutation RemoveProduct($input: RemoveProductInput!) {
    removeProduct(input: $input) {
      ${CART_FIELDS}
      ${CHECKOUT_ERRORS}
    }
  }
  ${CART_ITEM_FIELDS}
  ${UNAVAILABLE_ITEM_FIELDS}
`

export const REMOVE_PRODUCTS = `
  mutation RemoveProducts($input: RemoveProductsInput!) {
    removeProducts(input: $input) {
      ${CART_FIELDS}
      ${CHECKOUT_ERRORS}
    }
  }
  ${CART_ITEM_FIELDS}
  ${UNAVAILABLE_ITEM_FIELDS}
`

export const ADD_PRODUCT = `
  mutation AddProduct($quantity: Int!, $id: String!, $seller: String!, $userIsoDate: String!) {
    addProduct(quantity: $quantity, id: $id, seller: $seller, userIsoDate: $userIsoDate) {
      ${CART_FIELDS}
      ${ADD_PRODUCT_ERRORS}
    }
  }
  ${CART_ITEM_FIELDS}
  ${UNAVAILABLE_ITEM_FIELDS}
`
