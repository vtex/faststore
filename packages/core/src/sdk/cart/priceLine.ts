import { priceReasonLabel } from '@faststore/api'

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

export const formatCartLinePrice = (
  item: Pick<CartPriceLine, 'priceState'>,
  formatted: string
) => {
  if (item.priceState?.available === false) {
    return priceReasonLabel(item.priceState.reasonKey)
  }

  return formatted
}
