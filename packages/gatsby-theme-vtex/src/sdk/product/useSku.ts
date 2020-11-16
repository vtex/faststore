import { useCallback, useMemo } from 'react'

import { useSearchParams } from '../state/useSearchParams'

export interface Sku {
  itemId: string
}

interface Props<T extends Sku> {
  items: T[]
}

export const useSku = <T extends Sku>(product: Props<T>) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const skuId = searchParams.get('skuId')

  const setSku = useCallback(
    (id: string) => {
      searchParams.set('skuId', id)
      setSearchParams(searchParams, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  const sku = useMemo(() => {
    if (skuId === undefined) {
      return product.items[0]
    }

    return (
      product.items.find((item) => item.itemId === skuId) ?? product.items[0]
    )
  }, [product, skuId])

  return [sku, setSku] as [Sku, typeof setSku]
}
