import { useOrderForm } from '../../../sdk/orderForm/Provider'

export const useItem = (index: number) => {
  const { orderForm } = useOrderForm()
  const item = orderForm.items[index]

  return {
    quantity: item?.quantity ?? 1,
    id: Number(item?.id),
    seller: item?.seller ?? '1',
    sellingPrice: item?.sellingPrice ?? 0,
    name: item?.name ?? '',
    image: {
      alt: item?.name ?? '',
      src:
        item?.imageUrls?.at1x ??
        item?.imageUrls?.at2x ??
        item?.imageUrls?.at3x ??
        '',
    },
  }
}
