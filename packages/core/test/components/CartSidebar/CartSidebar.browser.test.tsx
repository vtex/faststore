import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    const source = Function.prototype.toString.call(loader)
    const chunk = /webpackChunkName:\s*"([^"]+)"/.exec(source)?.[1] ?? 'dynamic'

    return function DynamicStub({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) {
      const serializableProps = Object.fromEntries(
        Object.entries(props).filter(
          ([, value]) =>
            value == null ||
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        )
      )

      return React.createElement(
        'div',
        {
          'data-testid': chunk,
          'data-props': JSON.stringify(serializableProps),
        },
        children
      )
    }
  },
}))

const useUI = vi.hoisted(() => vi.fn())
vi.mock('@faststore/ui', () => ({
  Icon: ({ name }: { name?: string }) =>
    React.createElement('span', { 'data-testid': 'icon', 'data-name': name }),
  useFadeEffect: () => ({ fadeOut: vi.fn() }),
  useUI,
}))

const useCart = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/cart', () => ({ useCart }))

vi.mock('src/sdk/cart/useCheckoutButton', () => ({
  useCheckoutButton: () => ({
    onClick: vi.fn(),
    disabled: false,
    'data-testid': 'checkout-button',
  }),
}))

vi.mock('src/sdk/session', () => ({
  useSession: () => ({ currency: { code: 'USD' } }),
}))

vi.mock('@faststore/sdk', () => ({
  sendAnalyticsEvent: vi.fn(),
}))

import CartSidebar from 'src/components/cart/CartSidebar'

const CAMPAIGN_VRN = 'vrn:recommendations:acc:rec-cross-v2:campaign-1'

const cartItem = {
  id: 'item-1',
  quantity: 1,
  price: 100,
  listPrice: 120,
  itemOffered: {
    sku: 'sku-1',
    name: 'SKU 1',
    gtin: 'gtin-1',
    brand: { name: 'Brand' },
    isVariantOf: { productGroupID: 'pg-1', name: 'Product 1' },
  },
}

const sidebarProps = {
  title: 'Your cart',
  alert: {
    icon: { icon: 'Truck', alt: 'Truck' },
    text: 'Free shipping',
  },
  emptyCart: {
    title: 'Your Cart is empty',
    buttonLabel: 'Start Shopping',
  },
  checkoutButton: {
    label: 'Checkout',
    loadingLabel: 'Loading...',
    icon: { icon: 'ArrowRight', alt: 'Arrow Right' },
  },
  quantitySelector: { useUnitMultiplier: false },
}

const enabledRecommendations = {
  shouldDisplayRecommendationShelf: true,
  campaignVrn: CAMPAIGN_VRN,
  title: 'You may also like',
}

function filledCart() {
  useCart.mockReturnValue({
    items: [cartItem],
    gifts: [],
    totalItems: 1,
    isValidating: false,
    subTotal: 100,
    total: 100,
    subTotalWithTaxes: 110,
    totalWithTaxes: 110,
  })
}

function emptyCart() {
  useCart.mockReturnValue({
    items: [],
    gifts: [],
    totalItems: 0,
    isValidating: false,
    subTotal: 0,
    total: 0,
    subTotalWithTaxes: 0,
    totalWithTaxes: 0,
  })
}

beforeEach(() => {
  useUI.mockReturnValue({ cart: true, closeCart: vi.fn() })
  filledCart()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('CartSidebar recommendation shelf gate', () => {
  it('does not mount the shelf when the display toggle is off', () => {
    const { queryByTestId } = render(
      <CartSidebar
        {...sidebarProps}
        recommendations={{
          shouldDisplayRecommendationShelf: false,
          campaignVrn: CAMPAIGN_VRN,
        }}
      />
    )

    expect(queryByTestId('CartRecommendationShelf')).toBeNull()
    expect(queryByTestId('OrderSummary')).toBeTruthy()
  })

  it('does not mount the shelf when the toggle is on but campaign VRN is missing', () => {
    const { queryByTestId } = render(
      <CartSidebar
        {...sidebarProps}
        recommendations={{ shouldDisplayRecommendationShelf: true }}
      />
    )

    expect(queryByTestId('CartRecommendationShelf')).toBeNull()
  })

  it('does not mount the shelf on an empty cart, even with the toggle on', () => {
    emptyCart()

    const { queryByTestId } = render(
      <CartSidebar {...sidebarProps} recommendations={enabledRecommendations} />
    )

    expect(queryByTestId('EmptyCart')).toBeTruthy()
    expect(queryByTestId('CartRecommendationShelf')).toBeNull()
    expect(queryByTestId('OrderSummary')).toBeNull()
  })

  it('renders the shelf before OrderSummary when the cart has items', () => {
    const { getByTestId } = render(
      <CartSidebar {...sidebarProps} recommendations={enabledRecommendations} />
    )

    const footerChildren = Array.from(
      getByTestId('UICartSidebarFooter').children
    )

    expect(footerChildren[0]).toHaveAttribute(
      'data-testid',
      'CartRecommendationShelf'
    )
    expect(footerChildren[1]).toHaveAttribute('data-testid', 'OrderSummary')
  })

  it('omits shouldDisplayRecommendationShelf from the shelf props', () => {
    const { getByTestId } = render(
      <CartSidebar {...sidebarProps} recommendations={enabledRecommendations} />
    )

    const props = JSON.parse(
      getByTestId('CartRecommendationShelf').getAttribute('data-props') ?? '{}'
    ) as Record<string, unknown>

    expect(props).not.toHaveProperty('shouldDisplayRecommendationShelf')
    expect(props.campaignVrn).toBe(CAMPAIGN_VRN)
    expect(props.title).toBe('You may also like')
  })
})
