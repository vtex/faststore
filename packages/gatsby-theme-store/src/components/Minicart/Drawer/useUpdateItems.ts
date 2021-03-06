import { useOrderForm } from '../../../sdk/orderForm/useOrderForm'
import { useItem } from './useItem'

export const useUpdateItems = (index: number) => {
  const { updateItems } = useOrderForm()
  const item = useItem(index)

  return (quantity: number) =>
    updateItems([{ id: item.id, quantity, seller: item.seller, index }])
}
