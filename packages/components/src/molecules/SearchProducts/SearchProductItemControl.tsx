import React, {  forwardRef, HTMLAttributes, useCallback, useState } from 'react'
import { Badge, Icon, IconButton, Input, Loader, QuantitySelector } from '../..'

import type { ReactNode, MouseEvent } from 'react'

type StatusButtonAddToCartType = 'default' | 'inProgress' | 'completed'

export interface SearchProductItemControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  children: ReactNode
  availability: boolean
  hasVariants: boolean
  skuMatrixControl: ReactNode
  quantity: number
  onClick?(e: MouseEvent<HTMLButtonElement>): void
  onChangeQuantity(value: number): void
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
    onClick,
    onChangeQuantity,
    ...otherProps
  },
  ref
) {
  const [statusAddToCart, setStatusAddToCart] =
    useState<StatusButtonAddToCartType>('default')
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

	const showSKUMatrixControl = availability && hasVariants;
	const isMobile = window.innerWidth <= 768

  return (
    <div
      ref={ref}
      data-fs-search-product-item-control
      onClick={stopPropagationClick}
      {...otherProps}
    >
      <div data-fs-search-product-item-control-content>
        {!availability && (
          <Badge
            data-fs-search-product-item-control-badge
            variant="warning"
          >
            Out of Stock
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
          {!isMobile && (
            <QuantitySelector
              disabled={statusAddToCart !== 'default'}
              initial={quantity}
              onChange={onChangeQuantity}
            />
          )}

          {isMobile && (
						<Input
							data-fs-product-item-control-input
							type="number"
							min={1}
							value={quantity}
							onChange={(e) => onChangeQuantity(e.target.valueAsNumber)}
						/>
					)}

          <IconButton
            variant="primary"
            aria-label="Add product to cart"
            onClick={handleAddToCart}
            disabled={statusAddToCart === 'inProgress'}
            icon={getIcon()}
          />
        </div>
      )}

      {showSKUMatrixControl && skuMatrixControl}
    </div>
  )
})
export default SearchProductItemControl
