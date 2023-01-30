import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import type { PriceFormatter } from '../../atoms/Price/Price'

import {
  Link,
  Price,
  Button,
  Rating,
  DiscountBadge,
  LinkProps,
} from '../../index'
import { Star, ShoppingCart } from '../../assets'

interface Price {
  value: number
  listPrice: number
  formatter: PriceFormatter
}

export interface ProductCardContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the product's title.
   */
  title: string
  /**
   * Props for the link from ProductCard component.
   */
  linkProps?: Partial<LinkProps>
  /**
   * Specifies product Price.
   */
  price?: Price
  /**
   * Enables a Rating to the component.
   */
  ratingValue?: number
  /**
   * Enables a Button to the component.
   */
  onButtonClick?: () => void
  /**
   * Specifies the button's label.
   */
  buttonLabel?: string
  /**
   * Enables a DiscountBadge to the component.
   */
  showDiscountBadge?: boolean
}

const ProductCardContent = forwardRef<HTMLElement, ProductCardContentProps>(
  function CardContent(
    {
      testId = 'fs-product-card-content',
      title,
      linkProps,
      price,
      ratingValue,
      showDiscountBadge,
      buttonLabel = 'Add',
      onButtonClick,
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <section
        ref={ref}
        data-fs-product-card-content
        data-fs-product-card-badge={showDiscountBadge}
        data-testid={testId}
        {...otherProps}
      >
        <div data-fs-product-card-heading>
          <h3 data-fs-product-card-title>
            <Link {...linkProps} title={title}>
              {title}
            </Link>
          </h3>
          <div data-fs-product-card-prices>
            <Price
              value={price?.listPrice ? price.listPrice : 0}
              formatter={price?.formatter}
              testId="list-price"
              data-value={price?.listPrice}
              variant="listing"
            />
            <Price
              value={price?.value ? price.value : 0}
              formatter={price?.formatter}
              testId="price"
              data-value={price?.value}
              variant="spot"
            />
          </div>
          {ratingValue && <Rating value={ratingValue} icon={<Star />} />}
        </div>
        {showDiscountBadge && (
          <DiscountBadge
            listPrice={price?.listPrice ? price.listPrice : 0}
            spotPrice={price?.value ? price.value : 0}
          />
        )}
        {onButtonClick && (
          <div data-fs-product-card-actions>
            <Button
              variant="primary"
              icon={<ShoppingCart />}
              iconPosition="left"
              size="small"
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
          </div>
        )}
      </section>
    )
  }
)

export default ProductCardContent
