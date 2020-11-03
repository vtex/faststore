import { Box } from '@vtex/store-ui'
import { ProductQuantityTitle, NumericStepper } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  slug: string
  onChange: (quantity: number) => void
}

const Quantity: FC<Props> = ({ slug, onChange }) => {
  const quantity = { maxValue: undefined, minValue: 1, onChange }

  return (
    <Box>
      <ProductQuantityTitle>Quantity</ProductQuantityTitle>
      <NumericStepper {...quantity} />
    </Box>
  )
}

export default Quantity
