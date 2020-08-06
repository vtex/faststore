/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'

import { useBestSeller } from '../../hooks/useBestSeller'
import { useOrderForm } from '../../providers/OrderForm'

export interface Props {
  sku?: any
}

const BuyButton: FC<Props> = ({ sku }) => {
  const seller = useBestSeller(sku)
  const orderForm = useOrderForm()
  const disabled = !sku || !orderForm?.value

  // Optimist add item on click
  const addItemOnClick = async (e: any) => {
    e.preventDefault()

    if (!sku || !orderForm?.value || !seller) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: sku.itemId,
      quantity: 1,
      seller: (seller as any).sellerId,
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
