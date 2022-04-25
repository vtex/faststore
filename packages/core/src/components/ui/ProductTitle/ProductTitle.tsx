import { memo } from 'react'
import type { ReactNode } from 'react'

interface ProductTitleProp {
  /**
   * A react component to be used as the product title, e.g. an <h1>
   */
  title: ReactNode
  /**
   * A react component to be used as the product label, e.g. a <DiscountBadge>
   */
  label?: ReactNode
  /**
   * A text to be used below the title and the label, such as the product's reference number.
   */
  refNumber?: string
}

function ProductTitle({ title, label, refNumber }: ProductTitleProp) {
  return (
    <div className="product-title">
      <div className="product-title__header">
        {title}
        {!!label && label}
      </div>

      {refNumber && (
        <div className="product-title__addendum / text__legend">
          Ref.: {refNumber}
        </div>
      )}
    </div>
  )
}

export default memo(ProductTitle)
