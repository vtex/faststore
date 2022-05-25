import React from 'react'

import type { VariantFormProps } from '../VariantForm'
import VariantForm from '../VariantForm'

export type OutOfStockProps = Omit<VariantFormProps, 'variantDataAttribute'>

function OutOfStock({ ...props }: OutOfStockProps) {
  return <VariantForm variantDataAttribute="out-of-stock" {...props} />
}

export default OutOfStock
