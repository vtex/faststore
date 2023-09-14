import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import type { PriceDefinition } from '../../typings/PriceDefinition'

import {
  Badge,
  Button,
  DiscountBadge,
  Icon,
  Link,
  LinkElementType,
  LinkProps,
  Price,
  Rating,
} from '../../'

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
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * Specifies product's prices.
   */
  price?: PriceDefinition
  /**
   * Enables a outOfStock status.
   */
  outOfStock?: boolean
  /**
   * Specifies the OutOfStock badge's label.
   */
  outOfStockLabel?: string
  /**
   * Specifies Rating Value of the product.
   */
  ratingValue?: number
  /**
   * Specifies the button's label.
   */
  buttonLabel?: string
  /**
   * Enables a DiscountBadge to the component.
   */
  showDiscountBadge?: boolean
  /**
   * Callback function when button is clicked.
   */
  onButtonClick?: () => void
}

const ProductCardContent = forwardRef<HTMLElement, ProductCardContentProps>(
  function CardContent(
    {
      testId = 'fs-product-card-content',
      title,
      linkProps,
      price,
      outOfStock,
      outOfStockLabel = 'Out of stock',
      ratingValue,
      showDiscountBadge,
      buttonLabel = 'Add',
      onButtonClick,
      children,
      ...otherProps
    },
    ref
  ) {
    const listPrice = price?.listPrice ?? 0
    const sellingPrice = price?.value ?? 0

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
              <span>{title}</span>
            </Link>
          </h3>
          {!outOfStock && (
            <div data-fs-product-card-prices>
              {sellingPrice !== listPrice
                ? (
                  <>
                    <Price
                      value={listPrice}
                      formatter={price?.formatter}
                      testId="list-price"
                      data-value={listPrice}
                      variant="listing"
                      SRText="Original price:"
                    />
                    <Price
                      value={sellingPrice}
                      formatter={price?.formatter}
                      testId="price"
                      data-value={sellingPrice}
                      variant="spot"
                      SRText="Sale Price:"
                    />
                  </>
                )
                : (
                  <Price
                    value={sellingPrice}
                    formatter={price?.formatter}
                    testId="price"
                    data-value={sellingPrice}
                    variant="spot"
                    SRText="Sale Price:"
                  />
                )}
            </div>
          )}
          {ratingValue && (
            <Rating value={ratingValue} icon={<Icon name="Star" />} />
          )}
        </div>
        {showDiscountBadge && !outOfStock && (
          <DiscountBadge
            listPrice={price?.listPrice ? price.listPrice : 0}
            spotPrice={price?.value ? price.value : 0}
          />
        )}
        {outOfStock && <Badge>{outOfStockLabel}</Badge>}
        {onButtonClick && !outOfStock && (
          <div data-fs-product-card-actions>
            <Button
              variant="primary"
              icon={<Icon name="ShoppingCart" />}
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
