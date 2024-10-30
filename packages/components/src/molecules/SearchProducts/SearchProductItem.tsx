import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { Badge, Icon, IconButton, Loader, QuantitySelector } from '../..'
import { Link, LinkElementType, LinkProps } from '../..'

type StatusButtonAddToCartType = 'default' | 'inProgress' | 'completed'

export interface SearchProductItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Props for the link from SearchProduct component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * Props for Quick Order
   */
  quickOrder?: {
    enabled: boolean
    availability: boolean
  }
  /**
   * onClick from buyButton.
   */
  onClick?(e: React.MouseEvent<HTMLButtonElement>): void
}

const SearchProductItem = forwardRef<HTMLLIElement, SearchProductItemProps>(
  function ProductItem(
    {
      testId = 'fs-search-product-item',
      linkProps,
      children,
      quickOrder,
      onClick,
    },
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
      <li ref={ref} data-fs-search-product-item data-testid={testId}>
        <Link {...linkProps} data-fs-search-product-item-link variant="display">
          <div>
            {quickOrder?.enabled && !quickOrder.availability && (
              <Badge data-fs-search-product-item-badge variant="warning">
                Out of Stock
              </Badge>
            )}

            <div data-fs-search-product-item-content-wrapper>{children}</div>
          </div>

          {quickOrder?.enabled && quickOrder?.availability && (
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
        </Link>
      </li>
    )
  }
)

export default SearchProductItem
