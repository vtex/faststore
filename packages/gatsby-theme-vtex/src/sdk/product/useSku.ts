import { useMemo } from 'react'

interface Sku {
  itemId: string
}

interface Props {
  items: Sku[]
}

export const useSku = (product: Props | null, skuId?: string) =>
  useMemo(() => {
    if (product == null) {
      return
    }

    if (skuId === undefined) {
      return product.items![0]
    }

    return (
      product.items!.find((sku) => sku?.itemId === skuId) ?? product.items![0]
    )
  }, [product, skuId])
