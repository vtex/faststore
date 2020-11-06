import { useState } from 'react'

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

export const useBuyButton = (sku: Maybe<SKU>, quantity: number) => {
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
      quantity,
      seller: seller.sellerId,
    }

    try {
      setLoading(true)
      await orderForm.addToCart([orderFormItem])
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
