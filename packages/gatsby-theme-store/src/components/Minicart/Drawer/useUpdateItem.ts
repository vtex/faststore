import { useOrderItems } from '../../../sdk/orderForm/Provider'
import { useItem } from './useItem'

export const useUpdateItem = (index: number) => {
  const { updateQuantity } = useOrderItems()
  const item = useItem(index)

  return (quantity: number) =>
    updateQuantity({ id: `${item.id}`, quantity, seller: item.seller, index })
}
