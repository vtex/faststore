import { useCallback, useMemo } from 'react'

import { useSearchParams } from '../state/useSearchParams'

type Item = {
  itemId: string
  variations?: Array<{ name: string; values: string[] }>
  images: Array<{ imageUrl: string; imageText: string }>
  sellers: Array<{
    sellerId: string
    commercialOffer: {
      spotPrice: number
      availableQuantity: number
      price: number
      listPrice: number
      maxInstallments: Array<{
        value: number
        numberOfInstallments: number
      }>
      installments: Array<{
        value: number
        numberOfInstallments: number
        interestRate: number
      }>
      gifts: Array<{
        skuName: string
        images: Array<{ imageUrl: string }>
      }>
      teasers: Array<{ name: string }>
    }
  }>
}

type Sku = {
  productId: string
  productName: string
  productReference: string
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
