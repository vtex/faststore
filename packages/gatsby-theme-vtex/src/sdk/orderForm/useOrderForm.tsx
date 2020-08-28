import { useContext } from 'react'

import { OrderForm, OrderFormContext } from './Provider'

export const useOrderForm = (): Partial<OrderFormContext> =>
  useContext(OrderForm) ?? {}
