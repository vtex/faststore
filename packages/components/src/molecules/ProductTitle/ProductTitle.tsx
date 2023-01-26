import React, { forwardRef, HTMLAttributes } from 'react'
import type { ReactNode } from 'react'

import { Rating } from '../../index'
import type { RatingProps } from '../../index'

export type ProductTitleProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /**
   * A react component to be used as the product title, e.g. a `h1`
   */
  title: ReactNode
  /**
   * A react component to be used as the product label, e.g. a `DiscountBadge`
   */
  label?: ReactNode
  /**
   * Label for reference.
   */
  refTag?: string
  /**
   * A text to be used below the title and the label, such as the product's reference number.
   */
  refNumber?: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The current value of the rating, based on the quantity of child elements.
   */
  value?: number
} & Omit<RatingProps, 'testId' | 'onChange'>

const ProductTitle = forwardRef<HTMLElement, ProductTitleProps>(
  function ProductTitle(
    {
      title,
      label,
      refTag = 'Ref.: ',
      refNumber,
      testId = 'fs-product-title',
      value,
      ...otherProps
    },
    ref
  ) {
    return (
      <header
        ref={ref}
        data-fs-product-title
        data-testid={testId}
        {...otherProps}
      >
        <div data-fs-product-title-header>
          {title}
          {!!label && label}
        </div>

        {(refNumber || value) && (
          <p data-fs-product-title-addendum>
            {value && <Rating value={value} />}
            {refTag} {refNumber}
          </p>
        )}
      </header>
    )
  }
)

export default ProductTitle
