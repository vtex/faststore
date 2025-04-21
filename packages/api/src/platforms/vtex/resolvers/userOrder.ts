import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { Query } from './query'

type QueryUserOrder = PromiseType<ReturnType<typeof Query.userOrder>>

export type Root = QueryUserOrder

export const UserOrder: Record<string, Resolver<Root>> = {
  orderId: ({ orderId }) => orderId,
  totals: ({ totals }) => totals,
  items: ({ items }) => items,
  shippingData: ({ shippingData }) => shippingData,
  paymentData: ({ paymentData }) => paymentData,
}
