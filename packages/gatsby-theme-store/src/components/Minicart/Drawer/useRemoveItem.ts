import { useOrderItems } from '../../../sdk/orderForm/useOrderItems'
import { useItem } from './useItem'

export const useRemoveItem = (index: number) => {
  const { removeItem } = useOrderItems()
  const item = useItem(index)

  return () => removeItem({ id: `${item.id}`, seller: item.seller, index })
}
