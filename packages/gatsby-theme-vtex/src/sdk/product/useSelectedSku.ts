import { useLocation } from '@reach/router'

import { useSku, Sku } from './useSku'

interface Props {
  items: Sku[]
}

export const useParamFromUrl = (param: string) => {
  const location = useLocation()
  const querystring = location.search
  const match = new RegExp(`[\\?&]${param}=([^&#]*)`).exec(querystring)

  return match ? match[1] : undefined
}

export const useSelectedSku = (product: Props | null) => {
  const skuId = useParamFromUrl('skuId')

  return useSku(product, skuId)
}
