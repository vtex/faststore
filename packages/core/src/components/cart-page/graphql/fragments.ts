export const PRICE_VALUE_FRAGMENT = `
  fragment PriceValueFields on PriceValue {
    asCurrency
    asNumber
  }
`

export const PRODUCT_PRICE_FRAGMENT = `
  fragment ProductPriceFields on ProductPriceUnion {
    __typename
    ... on Price {
      total
      value { ...PriceValueFields }
    }
    ... on PriceWithDiscount {
      total
      value { ...PriceValueFields }
      originalValue
      valueWithDiscount { ...PriceValueFields }
    }
  }
`

export const SHIPPING_DATE_FRAGMENT = `
  fragment ShippingDateFields on ShippingDate {
    day
    month
    weekDay
    inHours
    inBusinessDays
  }
`

export const SHIPPING_DATE_UNION_FRAGMENT = `
  fragment ShippingDateUnionFields on ShippingDateUnion {
    ... on ShippingDate {
      ...ShippingDateFields
    }
    ... on RangeShippingDate {
      earlyDate { ...ShippingDateFields }
      lastDate { ...ShippingDateFields }
    }
  }
`

export const TAG_FRAGMENT = `
  fragment TagFields on Tag {
    id
    value
    type
  }
`

export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    name
    imageUrl
    quantity
    price { ...ProductPriceFields }
    tags { ...TagFields }
    measurementUnit
    originalIndex
    seller { id name }
    itemId
    productId
    skuName
    brandName
    categories { id name }
    productUrl
    offerings { id name price { ...PriceValueFields } type allowGiftMessage }
    costCenter { id name }
    selectedShippingOption {
      __typename
      ... on ProductDeliveryOption {
        id optionId name
        price { ...PriceValueFields }
        estimateDate { ...ShippingDateUnionFields }
      }
      ... on ProductPickupOption {
        id optionId name
        price { ...PriceValueFields }
        estimateDate { ...ShippingDateUnionFields }
      }
    }
    shippingOptions {
      ... on ProductDeliveryOptionAvailable { id optionId name }
      ... on ProductPickupOptionAvailable { id optionId name }
    }
    compositions { id name maxQuantity minQuantity items { id name imageUrl quantity } }
    compositionCount
    itemValue { ...ProductPriceFields }
    attachments { name content }
  }
`

export const PRODUCT_UNAVAILABLE_FRAGMENT = `
  fragment ProductUnavailableFields on BaseProductUnavailable {
    id
    name
    imageUrl
    quantity
    originalIndex
    itemId
    price {
      __typename
      ... on Price {
        total
        value { ...PriceValueFields }
      }
      ... on PriceWithDiscount {
        total
        value { ...PriceValueFields }
        originalValue
        valueWithDiscount { ...PriceValueFields }
      }
    }
    skuName
    brandName
    productId
    categories { id name }
    productUrl
    offerings { id name price { ...PriceValueFields } type allowGiftMessage }
    compositionCount
    compositions { id name maxQuantity minQuantity items { id name imageUrl quantity } }
    attachments { name content }
  }
`

export const DELIVERY_WINDOW_FRAGMENT = `
  fragment DeliveryWindowFields on DeliveryWindow {
    id
    optionId
    startDateUtc
    endDateUtc
    price { ...PriceValueFields }
    listPrice { ...PriceValueFields }
    tax { ...PriceValueFields }
  }
`

export const SINGLE_SLA_DELIVERY_FRAGMENT = `
  fragment SingleSlaDeliveryFields on SingleSlaDelivery {
    id
    total { ...PriceValueFields }
    items { ...ProductFields }
    estimateDate { ...ShippingDateFields }
    name
    availableDeliveryWindows { ...DeliveryWindowFields }
    selectedDeliveryWindow { ...DeliveryWindowFields }
  }
`

export const MULTI_SLA_DELIVERY_FRAGMENT = `
  fragment MultiSlaDeliveryFields on MultiSlaDelivery {
    id
    total { ...PriceValueFields }
    totalPackages
    estimateDates {
      earlyDate { ...ShippingDateFields }
      lastDate { ...ShippingDateFields }
    }
    packages {
      id slaId
      estimateDate { ...ShippingDateFields }
      totalItems
      items { ...ProductFields }
      shippingMethod { name total { ...PriceValueFields } }
      availableDeliveryWindows { ...DeliveryWindowFields }
      selectedDeliveryWindow { ...DeliveryWindowFields }
    }
    shippingMethods { name total { ...PriceValueFields } }
  }
`

export const DELIVERY_UNION_FRAGMENT = `
  fragment DeliveryUnionFields on DeliveryUnion {
    __typename
    ... on EmptyDelivery { id }
    ... on NoSlasDelivery {
      id
      address { addressId addressType street number city postalCode state receiverName country neighborhood complement reference geoCoordinates }
    }
    ... on Delivery {
      id
      selected {
        __typename
        ... on SingleSlaDelivery { ...SingleSlaDeliveryFields }
        ... on MultiSlaDelivery { ...MultiSlaDeliveryFields }
      }
      options {
        __typename
        ... on SingleSlaDelivery { ...SingleSlaDeliveryFields }
        ... on MultiSlaDelivery { ...MultiSlaDeliveryFields }
      }
      address { addressId addressType street number city postalCode state receiverName country neighborhood complement reference geoCoordinates }
    }
    ... on PreviewDelivery {
      id
      bestOptions { ...SingleSlaDeliveryFields }
      address { addressId addressType street number city postalCode state receiverName country neighborhood complement reference geoCoordinates }
    }
  }
`

export const PICKUP_OPTION_FRAGMENT = `
  fragment PickupOptionFields on PickupOption {
    id
    pickupPointId
    name
    address { addressId addressType street number city postalCode state receiverName country neighborhood complement reference geoCoordinates }
    distance
    businessHours { day openingTime closingTime }
    earliestEstimateDate { ...ShippingDateFields }
    estimateDate { ...ShippingDateFields }
    availableItems { ...ProductFields }
    packages { estimateDate { ...ShippingDateFields } slaId total items { ...ProductFields } totalItems }
    selectedPackages { estimateDate { ...ShippingDateFields } slaId total items { ...ProductFields } totalItems }
    unavailableItems { id name imageUrl }
    isValid
    slaId
    totalItems
    totalizers { items { ...PriceValueFields } shipping { ...PriceValueFields } total { ...PriceValueFields } }
    selectedPackagesTotalizers { items { ...PriceValueFields } shipping { ...PriceValueFields } total { ...PriceValueFields } }
  }
`

export const PICKUP_UNION_FRAGMENT = `
  fragment PickupUnionFields on PickupUnion {
    __typename
    ... on EmptyPickup { id }
    ... on Pickup {
      id
      selected { ...PickupOptionFields }
      options { ...PickupOptionFields }
      addressQuery
      address { addressId addressType street number city postalCode state receiverName country neighborhood complement reference geoCoordinates }
    }
    ... on PreviewPickup {
      id
      bestOption { ...PickupOptionFields }
      options { ...PickupOptionFields }
      addressQuery
      address { addressId addressType street number city postalCode state receiverName country neighborhood complement reference geoCoordinates }
    }
    ... on NoSlasPickup {
      id
      address { addressId addressType street number city postalCode state receiverName country neighborhood complement reference geoCoordinates }
    }
  }
`

export const SHIPPING_FRAGMENT = `
  fragment ShippingFields on Shipping_V2 {
    id
    delivery { ...DeliveryUnionFields }
    pickup { ...PickupUnionFields }
    deliveryChannels
    mode
  }
`

export const SUMMARY_FRAGMENT = `
  fragment SummaryFields on Summary {
    id
    totalizers {
      items
      shipping {
        __typename
        ... on ShippingTotalizer { value value_v2 { ...PriceValueFields } }
        ... on FreeShippingTotalizer { type }
        ... on ToBeCalculatedShippingTotalizer { type }
      }
      customTax
      customTax_v2 { ...PriceValueFields }
      discounts
      discounts_v2 { ...PriceValueFields }
    }
    giftCardTotalizer {
      count
      total { ...PriceValueFields }
      items { redemptionCode value { ...PriceValueFields } }
    }
    total { ...PriceValueFields }
  }
`

export const COUPON_FRAGMENT = `
  fragment CouponFields on CouponUnion {
    __typename
    ... on Coupon {
      id
      promoCodes { value isUnmatchedCondition }
    }
    ... on EmptyCoupon {
      id
    }
  }
`

export const CART_FRAGMENT = `
  fragment CartFields on CartUnion {
    __typename
    ... on Cart {
      id
      total
      availableItems { ...ProductFields }
      unavailableItems { ...ProductUnavailableFields }
      totalItems
      salesChannel
    }
    ... on EmptyCart {
      id
    }
  }
`

export const ALL_FRAGMENTS = [
  PRICE_VALUE_FRAGMENT,
  PRODUCT_PRICE_FRAGMENT,
  SHIPPING_DATE_FRAGMENT,
  SHIPPING_DATE_UNION_FRAGMENT,
  TAG_FRAGMENT,
  PRODUCT_FRAGMENT,
  PRODUCT_UNAVAILABLE_FRAGMENT,
  DELIVERY_WINDOW_FRAGMENT,
  SINGLE_SLA_DELIVERY_FRAGMENT,
  MULTI_SLA_DELIVERY_FRAGMENT,
  DELIVERY_UNION_FRAGMENT,
  PICKUP_OPTION_FRAGMENT,
  PICKUP_UNION_FRAGMENT,
  SHIPPING_FRAGMENT,
  SUMMARY_FRAGMENT,
  COUPON_FRAGMENT,
  CART_FRAGMENT,
].join('\n')
