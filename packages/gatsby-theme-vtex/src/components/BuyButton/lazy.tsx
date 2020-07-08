/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'

import { findBestSeller } from '../../utils/seller'
import { useAsyncProduct } from '../providers/AsyncProducts/controler'
import { useOrderForm } from '../providers/OrderForm/controler'

export interface Props {
  skuId: string
  index: number
}

const BuyButton: FC<Props> = ({ skuId, index }) => {
  const { addItems, value: orderForm, setOrderForm } = useOrderForm()
  const maybeProduct = useAsyncProduct(index)
  const sku = maybeProduct?.items?.find(({ itemId }) => itemId === skuId)

  // Optimist add item on click
  const addItemOnClick = async (e: any) => {
    e.preventDefault()
    if (!sku || !orderForm) {
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

    const addItemPromise = addItems([orderFormItem])

    /** Now let's update the orderForm optimistically */

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
      setOrderForm((of) => ({
        ...of!,
        items: [...of!.items, orderFormItem],
      }))
      await addItemPromise
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
