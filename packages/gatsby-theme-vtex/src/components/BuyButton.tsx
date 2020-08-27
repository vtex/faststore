/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { useBestSeller } from '../sdk/product/useBestSeller'
import { useOrderForm } from '../sdk/orderForm/useOrderForm'

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
  const { formatMessage } = useIntl()

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
      {formatMessage({ id: 'buy-button.add-to-cart' })}
    </Button>
  )
}

export default BuyButton
