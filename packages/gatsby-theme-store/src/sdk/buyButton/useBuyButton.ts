import { useState } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useOrderForm, useOrderItems } from '../orderForm/Provider'
import { useBestSeller } from '../product/useBestSeller'
import { usePixelEvent } from '../pixel/usePixelEvent'
import { useMinicart } from '../minicart/useMinicart'

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
}

export interface Props {
  sku: Maybe<SKU>
  quantity: number
  oneClickBuy?: boolean
  openMinicart?: boolean
}

export const useBuyButton = ({
  sku,
  quantity,
  oneClickBuy = false,
  openMinicart = true,
}: Props) => {
  const minicart = useMinicart()
  const [loading, setLoading] = useState(false)
  const seller = useBestSeller(sku)
  const { orderForm } = useOrderForm()
  const { addItem } = useOrderItems()
  const disabled = loading || !sku || !orderForm || !seller

  // Redirects the user to checkout after reassuring the pixel event was received
  usePixelEvent((e) => {
    if (e.type !== 'vtex:addToCart') {
      return
    }

    const isThisItem = e.data.items[0].id?.toString() === sku?.itemId

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

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: sku!.itemId,
      quantity,
      seller: seller.sellerId,
    }

    const orderFormItemWithPrice = {
      ...orderFormItem,
      id: Number(orderFormItem.id),
      price: seller.commercialOffer.price,
    }

    try {
      setLoading(true)
      const items = [orderFormItem]

      addItem(items)

      if (openMinicart) {
        minicart.toggle()
      }

      sendPixelEvent({
        type: 'vtex:addToCart',
        data: {
          items: [orderFormItemWithPrice],
          oneClickBuy,
        },
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    disabled,
    onClick,
    loading,
  }
}
