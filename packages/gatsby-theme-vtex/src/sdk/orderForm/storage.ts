import { OrderFormQueryQuery } from './__generated__/OrderFormQuery.graphql'

type OrderForm = OrderFormQueryQuery['vtex']['orderForm']

const ORDER_FORM_STORAGE_KEY = 'vtex:orderForm'

export const storage = {
  get: () => {
    const serialized = localStorage.getItem(ORDER_FORM_STORAGE_KEY)

    return serialized ? (JSON.parse(serialized) as OrderForm) : null
  },
  set: (data: OrderForm | null) => {
    localStorage.setItem(ORDER_FORM_STORAGE_KEY, JSON.stringify(data))
  },
}
