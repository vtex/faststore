import React, { forwardRef } from 'react'
import type { IProductComparison  } from './provider/ProductComparisonProvider'
import CheckboxField, { CheckboxFieldProps } from '../../molecules/CheckboxField'
import { useProductComparison } from '../../hooks/useProductComparison'

export type ProductComparisonTriggerProps = CheckboxFieldProps & {
  product: IProductComparison
}

const ProductComparisonTrigger = forwardRef<HTMLInputElement, ProductComparisonTriggerProps>(
  function ProductComparisonTrigger(
    { id, label, onChange, product,...otherProps },
    ref
  ) {

    const { productIds, handleProductsIds } = useProductComparison()

    const isSelected = productIds.some((productId) => productId === product.id)

    return (
      <CheckboxField
        data-fs-product-comparison-trigger
        ref={ref}
        id={`product-comparison-trigger-${id}`}
        label={label}
        checked={isSelected}
        onClick={(event) => {
          event.stopPropagation()
        }}
        onChange={(event) => {
          onChange?.(event)
          handleProductsIds(product)
        }}
        {...otherProps}/>
    )
  }
)

export default ProductComparisonTrigger