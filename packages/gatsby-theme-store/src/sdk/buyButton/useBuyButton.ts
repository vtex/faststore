import { useGlobalUIState } from '@vtex/store-sdk'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useOrderItems } from '../orderForm/useOrderItems'
import { useOrderForm } from '../orderForm/useOrderForm'
import { useBestSeller } from '../product/useBestSeller'
import { usePixelEvent } from '../pixel/usePixelEvent'
import type { PixelProduct } from '../pixel/events'

interface Seller {
  sellerId: string
  commercialOffer: {
    availableQuantity: number
    price: number
  }
}

export interface SKU {
  itemId: string
  sellers: Seller[]
  referenceId: Maybe<Array<{ value: Maybe<string> }>>
  name: string
  images?: Array<{
    imageUrl: string
  }>
}

export interface Product {
  id: string
  productName: string
  brand: string
  categoryTree: Array<{ name: string }>
  productReference: Maybe<string>
}

export interface Props {
  sku: Maybe<SKU>
  product: Maybe<Product>
  quantity: number
  oneClickBuy?: boolean
  openMinicart?: boolean
}

export const useBuyButton = ({
  sku,
  product,
  quantity,
  oneClickBuy = false,
  openMinicart: shouldOpenMinicart = true,
}: Props) => {
  const { openMinicart } = useGlobalUIState()
  const seller = useBestSeller(sku)
  const { orderForm, loading } = useOrderForm()
  const { addItems } = useOrderItems()
  const disabled =
    loading ||
    !sku ||
    !orderForm ||
    !seller ||
    !product ||
    seller.commercialOffer.availableQuantity === 0

  // Redirects the user to checkout after reassuring the pixel event was received
  usePixelEvent((e) => {
    if (e.type !== 'vtex:addToCart') {
      return
    }

    const isThisItem = e.data.products[0].skuId?.toString() === sku?.itemId

    if (!isThisItem || !e.data.oneClickBuy) {
      return
    }

    requestAnimationFrame(() => {
      window.location.href = '/checkout/'
    })
  })

  // Optimist add item on click
  const onClick = async (e: any) => {
    e.preventDefault()

    if (disabled) {
      return
    }

    const pixelEventProduct = {
      productId: product?.id,
      productReferenceId: product?.productReference,
      productName: product?.productName,
      brand: product?.brand,
      categoryTree: product?.categoryTree,
      price: seller.commercialOffer.price,
      // TODO currencyCode,
      quantity,
      skuId: sku?.itemId,
      skuName: sku?.name,
      skuReferenceId: sku?.referenceId,
    } as PixelProduct

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: Number(sku!.itemId),
      quantity,
      seller: seller.sellerId,
    }

    const orderFormItemWithPrice = {
      ...orderFormItem,
      id: sku!.itemId,
      price: seller.commercialOffer.price * 100,
      sellingPrice: seller.commercialOffer.price * 100,
      imageUrl: sku!.images?.[0]?.imageUrl,
      name: product?.productName,
    }

    try {
      const items = [orderFormItemWithPrice]

      addItems(items, { allowedOutdatedData: ['paymentData'] })

      if (shouldOpenMinicart) {
        openMinicart()
      }

      sendPixelEvent({
        type: 'vtex:addToCart',
        data: {
          products: [pixelEventProduct],
          oneClickBuy,
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  return {
    disabled,
    onClick,
    loading,
  }
}
