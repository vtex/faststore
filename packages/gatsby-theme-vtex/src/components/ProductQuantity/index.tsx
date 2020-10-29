import { Box } from '@vtex/store-ui'
import { ProductQuantityTitle, NumericStepper } from '@vtex/store-ui'
import React, { FC } from 'react'

import useProductQuantity from './useProductQuantity'

interface Props {
  slug: string
}

const Quantity: FC<Props> = ({ slug }) => {
  const quantity = useProductQuantity({ slug })

  return (
    <Box>
      <ProductQuantityTitle>Quantity</ProductQuantityTitle>
      <NumericStepper {...quantity} />
    </Box>
  )
}

export default Quantity
