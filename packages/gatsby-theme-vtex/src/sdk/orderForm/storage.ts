import { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

const ORDER_FORM_STORAGE_KEY = 'vtex:orderForm'

export const storage = {
  get: () => {
    const serialized = localStorage.getItem(ORDER_FORM_STORAGE_KEY)

    return serialized
      ? (JSON.parse(serialized) as OrderFormFragment_OrderFormFragment)
      : null
  },
  set: (data: OrderFormFragment_OrderFormFragment) => {
    localStorage.setItem(ORDER_FORM_STORAGE_KEY, JSON.stringify(data))
  },
}
