import { ALL_FRAGMENTS } from './fragments'

export const CART_PAGE_QUERY = `
  query CartPageQuery {
    cart { ...CartFields }
    summary { ...SummaryFields }
    shipping: shipping_v2(userIsoDate: "${new Date().toISOString()}") { ...ShippingFields }
    coupon { ...CouponFields }
    storePreferences {
      id
      currency
      country
    }
    oneClickCheckoutOptions {
      applePay
      googlePay
    }
    auth {
      isAuthenticated
    }
    customer: customer_v2 {
      __typename
      ... on Person {
        id
        firstName
        lastName
        email
      }
      ... on Organization {
        id
        name
      }
    }
    comment {
      id
      value
    }
    customFields {
      id
    }
  }
  ${ALL_FRAGMENTS}
`

export function buildCartPageQuery(): string {
  const userIsoDate = new Date().toISOString()

  return `
    query CartPageQuery {
      cart { ...CartFields }
      summary { ...SummaryFields }
      shipping: shipping_v2(userIsoDate: "${userIsoDate}") { ...ShippingFields }
      coupon { ...CouponFields }
      storePreferences {
        id
        currency
        country
      }
      oneClickCheckoutOptions {
        applePay
        googlePay
      }
      auth {
        isAuthenticated
      }
      customer: customer_v2 {
        __typename
        ... on Person {
          id
          firstName
          lastName
          email
        }
        ... on Organization {
          id
          name
        }
      }
      comment {
        id
        value
      }
      customFields {
        id
      }
    }
    ${ALL_FRAGMENTS}
  `
}
