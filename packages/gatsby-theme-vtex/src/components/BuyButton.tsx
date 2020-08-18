/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from '@vtex/store-ui'

import { useBestSeller } from '../sdk/product'
import { useOrderForm } from '../sdk/orderForm'
import { Maybe } from '../typings'

interface Seller {
  sellerId: string
  commertialOffer: {
    AvailableQuantity: number
    Price: number
  }
}

interface SKU {
  itemId: string
  sellers: Seller[]
}

export interface Props {
  sku: Maybe<SKU>
}

const BuyButton: FC<Props> = ({ sku }) => {
  const seller = useBestSeller(sku)
  const orderForm = useOrderForm()
  const disabled = !sku || !orderForm?.value

  // Optimist add item on click
  const addItemOnClick = async (e: any) => {
    e.preventDefault()

    if (!sku || !seller) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: sku.itemId,
      quantity: 1,
      seller: seller.sellerId,
    }

    orderForm.addItems([orderFormItem]).catch(console.error)
  }

  return (
    <Button
      sx={{ width: '100%' }}
      disabled={disabled}
      variant="primary"
      onClick={addItemOnClick}
    >
      ADD TO CART
    </Button>
  )
}

export default BuyButton
