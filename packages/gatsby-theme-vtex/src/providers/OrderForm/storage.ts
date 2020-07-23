import { OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'

const ORDER_FORM_STORAGE_KEY = 'vtex:orderForm'

export const storage = {
  get: () => {
    const serialized = localStorage.getItem(ORDER_FORM_STORAGE_KEY)

    return serialized ? (JSON.parse(serialized) as OrderFormType) : null
  },
  set: (data: OrderFormType) => {
    localStorage.setItem(ORDER_FORM_STORAGE_KEY, JSON.stringify(data))
  },
}
