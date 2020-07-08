/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'

import { findBestSeller } from '../../utils/seller'
import { useAsyncProduct } from '../providers/AsyncProducts/controler'
import { useOrderForm } from '../providers/OrderForm/controler'

export interface Props {
  skuId: string
  index?: number
}

const BuyButton: FC<Props> = ({ skuId, index }) => {
  const { addItems, value: orderForm } = useOrderForm()
  const maybeProduct = useAsyncProduct(index)
  const sku = maybeProduct?.items?.find(({ itemId }) => itemId === skuId)

  // Optimist add item on click
  const addItemOnClick = async (e: any) => {
    e.preventDefault()
    const seller = sku && findBestSeller([sku])

    if (!sku || !orderForm || !seller) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: sku.itemId,
      quantity: 1,
      seller: seller?.sellerId,
    }

    addItems([orderFormItem]).catch(console.error)
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
