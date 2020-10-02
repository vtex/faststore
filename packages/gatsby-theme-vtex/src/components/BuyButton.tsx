/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { useBuyButton } from '../sdk/buyButton/useBuyButton'

interface Seller {
  sellerId: string
  commercialOffer: {
    availableQuantity: number
    price: number
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
  const { formatMessage } = useIntl()
  const props = useBuyButton(sku as any)

  return (
    <Button {...props}>
      {formatMessage({ id: 'buy-button.add-to-cart' })}
    </Button>
  )
}

export default BuyButton
