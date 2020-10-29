import { Box } from '@vtex/store-ui'
import { ProductQuantityTitle, NumericStepper } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  slug: string
}

const Quantity: FC<Props> = ({ slug }) => {
  const quantity = { maxValue: undefined, minValue: 1 }

  return (
    <Box>
      <ProductQuantityTitle>Quantity</ProductQuantityTitle>
      <NumericStepper {...quantity} />
    </Box>
  )
}

export default Quantity
