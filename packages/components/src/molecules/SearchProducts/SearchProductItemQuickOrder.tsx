import React, { forwardRef, HTMLAttributes } from 'react'
import { Badge, Icon, IconButton, Loader, QuantitySelector } from '../..'
type StatusButtonAddToCartType = 'default' | 'inProgress' | 'completed'
export interface SearchQuickOrderContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  children: React.ReactNode
  availability: boolean
  hasVariants: boolean
  onClick?(e: React.MouseEvent<HTMLButtonElement>): void
}
const SearchProductItemQuickOrder = forwardRef<
  HTMLDivElement,
  SearchQuickOrderContentProps
>(function SearchQuickOrderContent(
  { availability, children, hasVariants, onClick, ...otherProps },
  ref
) {
  const [statusAddToCart, setStatusAddToCart] =
    React.useState<StatusButtonAddToCartType>('default')
  function stopPropagationClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      setStatusAddToCart('inProgress')
      onClick(event)
      setTimeout(() => setStatusAddToCart('completed'), 4000)
      setTimeout(() => setStatusAddToCart('default'), 6000)
    }
  }
  const getIcon = React.useCallback(() => {
    switch (statusAddToCart) {
      case 'inProgress':
        return <Loader />
      case 'completed':
        return <Icon name="Checked" width={24} height={24} />
      default:
        return <Icon name="ShoppingCart" width={24} height={24} />
    }
  }, [statusAddToCart])
  return (
    <div
      ref={ref}
      data-fs-search-product-item-quick-order
      onClick={stopPropagationClick}
      {...otherProps}
    >
      <div data-fs-search-product-item-quick-order-content>
        {!availability && (
          <Badge
            data-fs-search-product-item-quick-order-badge
            variant="warning"
          >
            Out of Stock
          </Badge>
        )}
        {children}
      </div>
      {availability && !hasVariants && (
        <div
          data-fs-search-product-item-quick-order-actions
          role="group"
          onClick={stopPropagationClick}
        >
          <QuantitySelector disabled={statusAddToCart !== 'default'} />
          <IconButton
            variant="primary"
            aria-label="Add product to cart"
            onClick={handleAddToCart}
            disabled={statusAddToCart === 'inProgress'}
            icon={getIcon()}
          />
        </div>
      )}

      {availability && hasVariants && <button>Select multiple</button>}
    </div>
  )
})
export default SearchProductItemQuickOrder
