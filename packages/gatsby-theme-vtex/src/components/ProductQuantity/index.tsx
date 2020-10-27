import { ProductQuantityTitle, NumericStepper } from '@vtex/store-ui'
import React, { FC, Fragment } from 'react'

import useProductQuantity from './useProductQuantity'

interface Props {
  slug: string
}

const Quantity: FC<Props> = ({ slug }) => {
  const quantity = useProductQuantity({ slug })

  return (
    <Fragment>
      <ProductQuantityTitle>Description</ProductQuantityTitle>
      <NumericStepper {...quantity} />
    </Fragment>
  )
}

export default Quantity
