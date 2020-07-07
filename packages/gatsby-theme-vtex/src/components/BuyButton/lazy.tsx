/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from 'theme-ui'
import { Item } from '@vtex/gatsby-source-vtex'

import { useOrderForm } from '../providers/OrderForm'

export interface Props {
  item?: Item
}

const BuyButton: FC<Props> = ({ item }) => {
  const { addItems } = useOrderForm()

  const addItemOnClick = (e: any) => {
    e.preventDefault()
    if (item) {
      const orderFormItem = {
        id: Number(item.itemId),
        quantity: 1,
        seller: Number(item.sellers[0]?.sellerId),
      }
      addItems([orderFormItem])
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
