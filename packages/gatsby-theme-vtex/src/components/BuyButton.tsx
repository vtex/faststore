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
  const { orderForm, addItems } = useOrderForm()
  const disabled = !sku || !orderForm
  const { formatMessage } = useIntl()

  // Optimist add item on click
  const handleButtonClick = async (e: any) => {
    e.preventDefault()

    if (!sku || !seller) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: parseInt(sku.itemId, 10),
      quantity: 1,
      seller: seller.sellerId,
      index: 0,
    }

    addItems?.([orderFormItem]).catch(console.error)
  }

  return (
    <Button
      sx={{ width: '100%' }}
      disabled={disabled}
      variant="primary"
      onClick={handleButtonClick}
    >
      {formatMessage({ id: 'buy-button.add-to-cart' })}
    </Button>
  )
}

export default BuyButton
