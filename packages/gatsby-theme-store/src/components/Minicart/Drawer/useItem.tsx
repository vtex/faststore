import { useOrderForm } from '../../../sdk/orderForm/Provider'

export const useItem = (index: number) => {
  const { orderForm } = useOrderForm()
  const item = orderForm.items[index]

  return {
    quantity: item?.quantity ?? 1,
    id: Number(item?.id),
    seller: item?.seller ?? '1',
  }
}
