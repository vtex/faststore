/** @jsx jsx */
import { Item } from '@vtex/gatsby-source-vtex'
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'

import { useOrderForm } from '../providers/OrderForm/manager'

export interface Props {
  item?: Item
}

const BuyButton: FC<Props> = ({ item }) => {
  const { addItems, orderForm, setOrderForm } = useOrderForm()

  // Optimist add item on click
  const addItemOnClick = async (e: any) => {
    e.preventDefault()
    if (!item) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: item.itemId,
      quantity: 1,
      seller: item.sellers[0]?.sellerId,
    }

    const oldOrderForm = {
      ...orderForm,
      items: [...orderForm.items],
    }

    // Optimistically update orderForm
    try {
      const found = orderForm.items.find((i) => i.id === orderFormItem.id)
      if (found) {
        return
      }
      const newOrderForm = {
        ...orderForm,
        items: [...orderForm.items, orderFormItem],
      }
      orderForm.items.push(orderFormItem)
      setOrderForm(newOrderForm)
      await addItems([orderFormItem])
    } catch (err) {
      // Something went wrong, let's restore the orderForm
      setOrderForm(oldOrderForm)
    }
  }

  return (
    <Button
      sx={{ width: '100%' }}
      variant={item ? 'primary' : 'secondary'}
      onClick={addItemOnClick}
    >
      ADD TO CART
    </Button>
  )
}

export default BuyButton
