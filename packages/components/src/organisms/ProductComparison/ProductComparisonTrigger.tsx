import React, { forwardRef } from 'react'
import type { IProductComparison } from '.'
import CheckboxField, {
  type CheckboxFieldProps,
} from '../../molecules/CheckboxField'
import { useProductComparison } from '../../hooks/useProductComparison'

export type ProductComparisonTriggerProps = CheckboxFieldProps & {
  /*
   * The product to be compared.
   */
  product: IProductComparison
}

const ProductComparisonTrigger = forwardRef<
  HTMLInputElement,
  ProductComparisonTriggerProps
>(function ProductComparisonTrigger(
  { id, label, onChange, product, ...otherProps },
  ref
) {
  const { productIds, handleProductsIds } = useProductComparison()

  const isSelected = productIds.some((productId) => productId === product.id)

  return (
    <div data-fs-product-comparison-trigger>
      {product.hasSpecifications && (
        <CheckboxField
          data-fs-product-comparison-trigger-checkbox-field
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
          {...otherProps}
        />
      )}
    </div>
  )
})

export default ProductComparisonTrigger
