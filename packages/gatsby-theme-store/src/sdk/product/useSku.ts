import { useCallback, useMemo } from 'react'

import { useSearchParams } from '../state/useSearchParams'

export type Item = {
  name: string
  complementName?: string
  itemId: string
  referenceId: Array<{ value: string }>
  videos: Array<{ videoUrl: string }>
  sellers: Array<{
    sellerId: string
    commercialOffer: {
      availableQuantity: number
      price: number
    }
  }>
  variations?: Array<{ name: string; values: string[] }>
  images: Array<{ imageUrl: string; imageText: string }>
}

export type Sku = {
  productId: string
  productClusters: Array<{ name: string }>
  productName: string
  productReference: string
  categoryTree: Array<{ name: string; href: string }>
  description: string
  linkText: string
  specificationGroups: Array<{
    name: string
    specifications: Array<{ name: string; values: string[] }>
  }>
  items: Item[]
}

export const useSku = (product: Sku) => {
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

  return [sku, setSku] as [Item, typeof setSku]
}
