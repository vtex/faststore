/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'

import { useOrderForm } from '../providers/OrderForm/controler'
import { useAsyncProduct } from '../providers/AsyncProduct/controler'
import { findBestSeller } from '../../utils/seller'

export interface Props {
  skuId: string
}

const BuyButton: FC<Props> = ({ skuId }) => {
  const { addItems, orderForm, setOrderForm } = useOrderForm()
  const asyncProduct = useAsyncProduct()
  const sku = asyncProduct.items?.find(({ itemId }) => itemId === skuId)

  // Optimist add item on click
  const addItemOnClick = async (e: any) => {
    e.preventDefault()
    if (!sku) {
      return
    }

    const seller = findBestSeller([sku])

    if (!seller) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: sku.itemId,
      quantity: 1,
      seller: seller?.sellerId,
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
      variant={sku ? 'primary' : 'secondary'}
      onClick={addItemOnClick}
    >
      ADD TO CART
    </Button>
  )
}

export default BuyButton
