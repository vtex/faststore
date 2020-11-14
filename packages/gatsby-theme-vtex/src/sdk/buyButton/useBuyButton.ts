import { useState } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useOrderForm } from '../orderForm/useOrderForm'
import { useBestSeller } from '../product/useBestSeller'
import { usePixelEvent } from '../pixel/usePixelEvent'

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
}

export const useBuyButton = ({ sku, quantity, oneClickBuy }: Props) => {
  const [loading, setLoading] = useState(false)
  const seller = useBestSeller(sku)
  const orderForm = useOrderForm()
  const disabled = loading || !sku || !orderForm?.value || !seller

  // Redirects the user to checkout after reassuring the pixel event was received
  usePixelEvent((e) => {
    if (!oneClickBuy && e.type !== 'vtex:addToCart') {
      return
    }

    const isThisItem = e.data.items[0].id?.toString() === sku?.itemId

    if (!isThisItem) {
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
      id: Number(sku!.itemId),
      quantity,
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
