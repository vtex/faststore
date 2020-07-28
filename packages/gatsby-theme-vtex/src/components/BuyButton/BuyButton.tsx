import React, { FC } from 'react'

import { useOrderForm } from '../../providers/OrderForm'
import { ArrayItem } from '../../types/array'
import { findBestSeller, Item as SellerItem } from '../../utils/seller'
import Button from '../material-ui-components/Button'

type Seller = ArrayItem<SellerItem['sellers']> & {
  sellerId: string
}

type Item = SellerItem & {
  itemId: string
  sellers: Seller[]
}

export interface Props {
  sku?: Item
}

const BuyButton: FC<Props> = ({ sku }) => {
  const orderForm = useOrderForm()
  const disabled = !sku || !orderForm?.value

  // Optimist add item on click
  const addItemOnClick = async (e: any) => {
    e.preventDefault()
    const seller = sku && (findBestSeller(sku) as Seller)

    if (!sku || !orderForm?.value || !seller) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: sku.itemId,
      quantity: 1,
      seller: seller?.sellerId,
    }

    orderForm.addItems([orderFormItem]).catch(console.error)
  }

  return (
    <Button fullWidth disabled={disabled} onClick={addItemOnClick}>
      ADD TO CART
    </Button>
  )
}

export default BuyButton
