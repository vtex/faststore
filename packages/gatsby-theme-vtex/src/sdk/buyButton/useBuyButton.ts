import { useState } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useOrderForm } from '../orderForm/useOrderForm'
import { useBestSeller } from '../product/useBestSeller'

interface Seller {
  sellerId: string
  commercialOffer: {
    availableQuantity: number
    price: number
  }
}

export interface SKU {
  itemId: number
  sellers: Seller[]
}

export const useBuyButton = (sku: Maybe<SKU>) => {
  const [loading, setLoading] = useState(false)
  const seller = useBestSeller(sku)
  const orderForm = useOrderForm()
  const disabled = loading || !sku || !orderForm?.value || !seller

  // Optimist add item on click
  const onClick = async (e: any) => {
    e.preventDefault()

    if (disabled) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: Number(sku!.itemId),
      quantity: 1,
      seller: seller.sellerId,
    }

    try {
      setLoading(true)
      const items = [orderFormItem]

      await orderForm.addToCart(items)

      sendPixelEvent({
        type: 'vtex:addToCart',
        data: {
          items,
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
