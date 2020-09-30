/** @jsx jsx */
import { FC } from 'react'
import { Button, jsx } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { SKU, useBuyButton } from '../../sdk/buyButton/useBuyButton'

export interface Props {
  sku?: Maybe<SKU>
}

const BuyButton: FC<Props> = ({ sku }) => {
  const { formatMessage } = useIntl()
  const props = useBuyButton(sku)

  return (
    <Button sx={{ width: '100%' }} {...props}>
      {formatMessage({ id: 'buy-button.add-to-cart' })}
    </Button>
  )
}

export default BuyButton
