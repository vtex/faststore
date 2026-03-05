const PRODUCT_PRICE_UNION_FIELDS = `
  ... on Price {
    __typename
    total
    value {
      asCurrency
      asNumber
    }
  }
  ... on PriceWithDiscount {
    __typename
    originalValue
    total
    value {
      asCurrency
      asNumber
    }
    valueWithDiscount {
      asCurrency
      asNumber
    }
  }
`

export const CART_ITEM_FIELDS = `
  fragment CartItemFields on Product {
    id
    itemId
    productId
    name
    imageUrl
    quantity
    originalIndex
    measurementUnit
    seller {
      id
      name
    }
    tags {
      id
      type
      value
    }
    price {
      ${PRODUCT_PRICE_UNION_FIELDS}
    }
    compositions {
      id
      name
      items {
        id
        name
        quantity
        value {
          ${PRODUCT_PRICE_UNION_FIELDS}
        }
        itemValue {
          ${PRODUCT_PRICE_UNION_FIELDS}
        }
        availability
      }
    }
    compositionCount
  }
`

export const UNAVAILABLE_ITEM_FIELDS = `
  fragment UnavailableItemFields on BaseProductUnavailable {
    id
    itemId
    productId
    name
    imageUrl
    quantity
    originalIndex
    price {
      ${PRODUCT_PRICE_UNION_FIELDS}
    }
    compositions {
      id
      name
      items {
        id
        name
        quantity
        value {
          ${PRODUCT_PRICE_UNION_FIELDS}
        }
        itemValue {
          ${PRODUCT_PRICE_UNION_FIELDS}
        }
        availability
      }
    }
    compositionCount
  }
`

export const CART_QUERY = `
  query CartQuery {
    cart {
      ... on Cart {
        __typename
        id
        total
        totalItems
        salesChannel
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
  }
  ${CART_ITEM_FIELDS}
  ${UNAVAILABLE_ITEM_FIELDS}
`
