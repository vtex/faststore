export const PRICE_REQUIRES_LOGIN = 'PRICE_REQUIRES_LOGIN'

export interface CartPriceMessages {
  login: string
  generic: string
}

export const DEFAULT_CART_PRICE_MESSAGES: CartPriceMessages = {
  login: 'Sign in to see the price',
  generic: 'Calculating',
}

export interface CartPriceLine {
  price: number
  quantity: number
  priceState?: {
    available: boolean
    reasonKey?: string | null
  } | null
}

export const isGift = (item: Pick<CartPriceLine, 'price' | 'priceState'>) =>
  item.price === 0 && item.priceState?.available !== false

export const lineTotal = (item: CartPriceLine) =>
  item.priceState?.available === false ? 0 : item.price * item.quantity

export const lineTotalWithTaxes = (
  item: CartPriceLine & { priceWithTaxes: number }
) =>
  item.priceState?.available === false ? 0 : item.priceWithTaxes * item.quantity

export const subtotalAmount = (
  item: Pick<CartPriceLine, 'priceState'>,
  amount: number
) => (item.priceState?.available === false ? 0 : amount)

export const formatCartLinePrice = (
  item: Pick<CartPriceLine, 'priceState'>,
  formatted: string,
  messages: CartPriceMessages = DEFAULT_CART_PRICE_MESSAGES,
  showReason = true
) => {
  if (item.priceState?.available === false) {
    if (!showReason) {
      return ''
    }

    return item.priceState.reasonKey === PRICE_REQUIRES_LOGIN
      ? messages.login
      : messages.generic
  }

  return formatted
}
