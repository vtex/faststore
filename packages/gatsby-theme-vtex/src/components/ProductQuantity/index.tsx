import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box } from '@vtex/store-ui'
import { ProductQuantityTitle, NumericStepper } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  slug: string
  onChange: (quantity: number) => void
}

const Quantity: FC<Props> = ({ slug, onChange }) => {
  const quantity = { maxValue: undefined, minValue: 1, onChange }
  const { formatMessage } = useIntl()

  return (
    <Box>
      <ProductQuantityTitle>
        {formatMessage({ id: 'product.quantity.title' })}
      </ProductQuantityTitle>
      <NumericStepper {...quantity} />
    </Box>
  )
}

export default Quantity
