import { useLocation } from '@reach/router'

import { useSku, Sku } from './useSku'

interface Props {
  items: Sku[]
}

export const useSelectedSku = (product: Props | null) => {
  const location = useLocation()
  const querystring = location.search
  const match = /[\\?&]skuId=([^&#]*)/.exec(querystring)
  const skuId = match ? match[1] : undefined

  return useSku(product, skuId)
}
