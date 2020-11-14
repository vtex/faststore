import { useSku, Sku } from './useSku'
import { useSearchParams } from '../state/useSearchParams'

interface Props {
  items: Sku[]
}

export const useSelectedSku = (product: Props | null) => {
  const skuId = useSearchParams()[0].get('skuId')

  return useSku(product, skuId || undefined)
}
