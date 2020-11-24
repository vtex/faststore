import { useOrderForm } from '../../../sdk/orderForm/useOrderForm'

export const useItem = (index: number) => {
  const { value } = useOrderForm()
  const item = value?.items[index]

  return {
    quantity: item?.quantity ?? 1,
    id: Number(item?.id),
    seller: item?.seller ?? '1',
  }
}
