import React, { forwardRef, HTMLAttributes, useCallback, useState } from 'react'
import { Badge, Icon, IconButton, Input, Loader, QuantitySelector } from '../..'

import type { MouseEvent, ReactNode } from 'react'

type StatusButtonAddToCartType = 'default' | 'inProgress' | 'completed'

export interface SearchProductItemControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  /**
   * Renders child elements.
   */
  children: ReactNode
  /**
   * Specifies the label for out-of-stock products.
   */
  outOfStockLabel: string
  /**
   * Specifies whether the product is available.
   */
  availability: boolean
  /**
   * Specifies whether the product has variations.
   */
  hasVariants: boolean
  /**
   * Renders the elements of the SKUMatrix.
   */
  skuMatrixControl: ReactNode
  /**
   * The maximum value the input can receive
   */
  max?: number
  /**
   * The minimum value the input can receive
   */
  min?: number
  /**
   * Specifies the quantity to be added to the cart.
   */
  quantity: number
  /**
   * Callback that fires when the add to cart button is clicked.
   */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  /**
   * Callback that fires when the input value changes.
   */
  onChangeQuantity: (value: number) => void
  /**
   * Event emitted when value is out of the min and max bounds
   */
  onValidateBlur?: (min: number, maxValue: number, quantity: number) => void
}

const SearchProductItemControl = forwardRef<
  HTMLDivElement,
  SearchProductItemControlProps
>(function SearchProductItemControl(
  {
    availability,
    children,
    hasVariants,
    skuMatrixControl,
    quantity,
    outOfStockLabel,
    min = 1,
    max = undefined,
    onClick,
    onChangeQuantity,
    onValidateBlur,
    ...otherProps
  },
  ref
) {
  const [statusAddToCart, setStatusAddToCart] =
    useState<StatusButtonAddToCartType>('default')

  const showSKUMatrixControl = availability && hasVariants

  function stopPropagationClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      setStatusAddToCart('inProgress')

      setTimeout(() => {
        setStatusAddToCart('completed')
        onClick(event)
      }, 1000)

      setTimeout(() => {
        setStatusAddToCart('default')
        onChangeQuantity(1)
      }, 2000)
    }
  }

  const getIcon = useCallback(() => {
    switch (statusAddToCart) {
      case 'inProgress':
        return <Loader />
      case 'completed':
        return <Icon name="Checked" width={24} height={24} />
      default:
        return <Icon name="ShoppingCart" width={24} height={24} />
    }
  }, [statusAddToCart])

  function validateBlur() {
    const maxValue = max ?? (min ? Math.max(quantity, min) : quantity)
    const isOutOfBounds = quantity > maxValue || quantity < min
    const minQuantity = quantity < min ? min : quantity
    const realQuantity = quantity > maxValue ? maxValue : minQuantity

    if (isOutOfBounds) {
      onValidateBlur?.(min, maxValue, realQuantity)
    }

    onChangeQuantity(realQuantity)
  }

  return (
    <div ref={ref} data-fs-search-product-item-control {...otherProps}>
      <div data-fs-search-product-item-control-content>
        {!availability && (
          <Badge data-fs-search-product-item-control-badge variant="warning">
            {outOfStockLabel}
          </Badge>
        )}
        {children}
      </div>
      {availability && !hasVariants && (
        <div
          data-fs-search-product-item-control-actions
          role="group"
          onClick={stopPropagationClick}
        >
          <div data-fs-search-product-item-control-actions-desktop>
            <QuantitySelector
              disabled={statusAddToCart !== 'default'}
              max={max}
              onValidateBlur={onValidateBlur}
              onChange={onChangeQuantity}
            />
          </div>

          <div data-fs-search-product-item-control-actions-mobile>
            <Input
              data-fs-product-item-control-input
              min={1}
              value={quantity}
              onChange={(e) =>
                onChangeQuantity(e.target.value ? Number(e.target.value) : 0)
              }
              onBlur={validateBlur}
              onInput={(event: React.FormEvent<HTMLInputElement>) => {
                const input = event.currentTarget
                input.value = input.value.replace(/\D/g, '')
              }}
            />
          </div>

          <IconButton
            variant="primary"
            aria-label="Add product to cart"
            onClick={handleAddToCart}
            disabled={statusAddToCart === 'inProgress'}
            icon={getIcon()}
          />
        </div>
      )}

      {showSKUMatrixControl && (
        <div onClick={stopPropagationClick}>{skuMatrixControl}</div>
      )}
    </div>
  )
})
export default SearchProductItemControl
