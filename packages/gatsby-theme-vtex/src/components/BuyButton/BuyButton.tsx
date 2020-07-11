/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'

import { useOrderForm } from '../../providers/OrderForm'
import { ArrayItem } from '../../types/array'
import { findBestSeller, Item as SellerItem } from '../../utils/seller'

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
