/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'
import { graphql } from 'gatsby'

import { useBestSeller } from '../hooks/useBestSeller'
import { useOrderForm } from '../providers/OrderForm'
import { BuyButton_SkuFragment } from './__generated__/BuyButton_sku.graphql'

export interface Props {
  sku?: BuyButton_SkuFragment
}

const BuyButton: FC<Props> = ({ sku }) => {
  const seller: any = useBestSeller(sku as any)
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
      id: sku.itemId!,
      quantity: 1,
      seller: seller.sellerId!,
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

export const fragment = graphql`
  fragment BuyButton_sku on VTEX_SKU {
    itemId
    sellers {
      sellerId
      commertialOffer {
        AvailableQuantity
        Price
      }
    }
  }
`

export default BuyButton
