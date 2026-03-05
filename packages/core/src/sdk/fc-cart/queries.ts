const PRICE_FRAGMENT = `
  __typename
  ... on Price {
    total
    value { asCurrency asNumber }
  }
  ... on PriceWithDiscount {
    total
    value { asCurrency asNumber }
    originalValue
    valueWithDiscount { asCurrency asNumber }
  }
`

const CART_PRODUCT_FIELDS = `
  id
  name
  skuName
  imageUrl
  quantity
  originalIndex
  productId
  itemId
  brandName
  productUrl
  seller {
    id
    name
  }
  price { ${PRICE_FRAGMENT} }
  itemValue { ${PRICE_FRAGMENT} }
`

const UNAVAILABLE_PRODUCT_FIELDS = `
  id
  name
  skuName
  imageUrl
  quantity
  originalIndex
  productUrl
  price { ${PRICE_FRAGMENT} }
`

const SUMMARY_FIELDS = `
  id
  total { asCurrency asNumber }
  totalizers {
    items
    discounts
  }
`

const CART_UNION_FIELDS = `
  __typename
  ... on Cart {
    id
    total
    totalItems
    salesChannel
    availableItems { ${CART_PRODUCT_FIELDS} }
    unavailableItems { ${UNAVAILABLE_PRODUCT_FIELDS} }
  }
  ... on EmptyCart {
    id
  }
`

export const CART_QUERY = `
  query FCCart {
    cart {
      ${CART_UNION_FIELDS}
    }
  }
`

const CHANGE_QTY_ERRORS = `
  ... on CheckoutAPIError { message }
  ... on ItemMaxQuantityLimitReachedError { message }
  ... on ItemQuantityNotAvailableError { message }
`

const REMOVE_ERRORS = `
  ... on CheckoutAPIError { message }
  ... on InvalidIndexError { message }
`

export const CHANGE_QUANTITY_MUTATION = `
  mutation FCChangeQuantity($itemIndex: Int!, $quantity: Int!, $userIsoDate: String!) {
    changeProductQuantity(itemIndex: $itemIndex, quantity: $quantity, userIsoDate: $userIsoDate) {
      cart { ${CART_UNION_FIELDS} }
      summary { ${SUMMARY_FIELDS} }
      errors { ${CHANGE_QTY_ERRORS} }
    }
  }
`

export const REMOVE_PRODUCT_MUTATION = `
  mutation FCRemoveProduct($input: RemoveProductInput!) {
    removeProduct(input: $input) {
      cart { ${CART_UNION_FIELDS} }
      summary { ${SUMMARY_FIELDS} }
      errors { ${REMOVE_ERRORS} }
    }
  }
`

export const REMOVE_PRODUCTS_MUTATION = `
  mutation FCRemoveProducts($input: RemoveProductsInput!) {
    removeProducts(input: $input) {
      cart { ${CART_UNION_FIELDS} }
      summary { ${SUMMARY_FIELDS} }
      errors { ${REMOVE_ERRORS} }
    }
  }
`
