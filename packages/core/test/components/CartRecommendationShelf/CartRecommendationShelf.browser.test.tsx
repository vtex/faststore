import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@faststore/ui', () => {
  const passthrough = ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children)
  return { ProductShelf: passthrough, Carousel: passthrough }
})

const productCardProps = vi.hoisted(() => vi.fn())
vi.mock('src/components/product/ProductCard', () => ({
  default: (props: Record<string, unknown>) => {
    productCardProps(props)
    return React.createElement('div', { 'data-testid': 'product-card' })
  },
}))

vi.mock('src/components/skeletons/ProductShelfSkeleton', () => ({
  default: ({
    children,
    loading,
    itemsPerPage,
  }: React.PropsWithChildren<{ loading?: boolean; itemsPerPage?: number }>) =>
    React.createElement(
      'div',
      {
        'data-testid': 'skeleton',
        'data-loading': String(!!loading),
        'data-items-per-page': String(itemsPerPage),
      },
      children
    ),
}))

const useRecommendationShelf = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/recommendations', () => ({ useRecommendationShelf }))

vi.mock('src/sdk/cart/useBuyButton', () => ({
  useBuyButton: () => ({
    onClick: vi.fn(),
    'data-testid': 'buy-button',
  }),
}))

vi.mock('src/sdk/ui/useScreenResize', () => ({
  default: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    loading: false,
  }),
}))

import CartRecommendationShelf from 'src/components/cart/CartRecommendationShelf'

const CAMPAIGN_VRN = 'vrn:recommendations:acc:rec-cross-v2:campaign-1'

const recommendationProduct = (id: string, productGroupID: string) => ({
  id,
  sku: `sku-${id}`,
  gtin: `gtin-${id}`,
  brand: { name: 'Brand' },
  unitMultiplier: 1,
  additionalProperty: [],
  isVariantOf: { productGroupID, name: `Product ${id}` },
  image: [{ url: `https://example.com/${id}.jpg`, alternateName: id }],
  offers: {
    lowPrice: 100,
    lowPriceWithTaxes: 110,
    offers: [
      {
        availability: 'https://schema.org/InStock',
        listPrice: 120,
        listPriceWithTaxes: 130,
        price: 100,
        priceWithTaxes: 110,
        seller: { identifier: '1' },
        priceToken: 'token',
        quantity: 1,
      },
    ],
  },
})

const result = (overrides: Record<string, unknown> = {}) => ({
  items: [
    recommendationProduct('p-1', 'pg-1'),
    recommendationProduct('p-2', 'pg-2'),
  ],
  isLoading: false,
  error: null,
  campaign: { id: 'camp-1', title: 'You may also like', type: 'CROSS_SELL' },
  correlationId: 'corr-1',
  ...overrides,
})

beforeEach(() => {
  useRecommendationShelf.mockReturnValue(result())
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('CartRecommendationShelf', () => {
  it('delegates to RecommendationShelf with cart context', () => {
    render(<CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />)

    expect(useRecommendationShelf).toHaveBeenCalledWith({
      campaignVrn: CAMPAIGN_VRN,
      itemsContext: 'CART',
    })
  })

  it('renders a card per recommended product under the campaign title', () => {
    const { getAllByTestId, getByText } = render(
      <CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />
    )

    expect(getAllByTestId('product-card')).toHaveLength(2)
    expect(getByText('You may also like')).toBeTruthy()
  })

  it('prefers the configured title over the campaign title', () => {
    const { getByText, queryByText } = render(
      <CartRecommendationShelf
        campaignVrn={CAMPAIGN_VRN}
        title="Complete your purchase"
      />
    )

    expect(getByText('Complete your purchase')).toBeTruthy()
    expect(queryByText('You may also like')).toBeNull()
  })

  it('renders nothing when the campaign returns no products', () => {
    useRecommendationShelf.mockReturnValue(result({ items: [] }))

    const { container } = render(
      <CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the request fails, leaving the cart untouched', () => {
    useRecommendationShelf.mockReturnValue(
      result({ items: [], error: new Error('boom') })
    )

    const { container } = render(
      <CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the skeleton while loading', () => {
    useRecommendationShelf.mockReturnValue(
      result({ items: [], isLoading: true })
    )

    const { getByTestId } = render(
      <CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />
    )

    expect(getByTestId('skeleton').getAttribute('data-loading')).toBe('true')
  })

  it('rounds a fractional items per page up for the skeleton', () => {
    useRecommendationShelf.mockReturnValue(
      result({ items: [], isLoading: true })
    )

    const { getByTestId } = render(
      <CartRecommendationShelf
        campaignVrn={CAMPAIGN_VRN}
        carouselConfiguration={{ itemsPerPage: 1.5 }}
      />
    )

    expect(getByTestId('skeleton').getAttribute('data-items-per-page')).toBe(
      '2'
    )
  })

  it('tags the shelf root so the cart drawer can target it', () => {
    const { container } = render(
      <CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />
    )

    const shelf = container.querySelector('[data-fs-recommendation-shelf]')
    expect(shelf).toBeTruthy()
    expect(shelf?.hasAttribute('data-fs-cart-recommendation-shelf')).toBe(true)
  })

  it('tags impressions with Activity Flow attributes', () => {
    const { container } = render(
      <CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />
    )

    const shelf = container.querySelector(
      '[data-af-element="recommendation-shelf"]'
    )
    expect(shelf).toBeTruthy()
    expect(shelf?.getAttribute('data-af-campaign-id')).toBe('camp-1')
    expect(shelf?.getAttribute('data-af-products')).toBe('pg-1, pg-2')

    const firstItem = container.querySelector(
      '[data-fs-recommendation-shelf-item]'
    )
    expect(firstItem?.getAttribute('data-af-element')).toBe(
      'recommendation-shelf-product'
    )
    expect(firstItem?.getAttribute('data-af-product-position')).toBe('1')
  })

  it('forwards the drawer taxes configuration to every card', () => {
    const taxesConfiguration = {
      usePriceWithTaxes: true,
      taxesLabel: 'Tax included',
    }

    render(
      <CartRecommendationShelf
        campaignVrn={CAMPAIGN_VRN}
        taxesConfiguration={taxesConfiguration}
      />
    )

    expect(productCardProps).toHaveBeenCalledWith(
      expect.objectContaining({ taxesConfiguration })
    )
  })

  it('renders unbordered cards by default and honours the override', () => {
    render(<CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />)

    expect(productCardProps).toHaveBeenCalledWith(
      expect.objectContaining({ bordered: false })
    )

    productCardProps.mockClear()

    render(
      <CartRecommendationShelf
        campaignVrn={CAMPAIGN_VRN}
        productCardConfiguration={{ bordered: true }}
      />
    )

    expect(productCardProps).toHaveBeenCalledWith(
      expect.objectContaining({ bordered: true })
    )
  })

  it('uses CartRecommendationProductCard by default so cards expose add-to-cart', () => {
    render(<CartRecommendationShelf campaignVrn={CAMPAIGN_VRN} />)

    expect(productCardProps).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonLabel: 'Add to cart',
        onButtonClick: expect.any(Function),
      })
    )
  })

  it('forwards a custom ProductCard to RecommendationShelf', () => {
    const CustomCard = (props: Record<string, unknown>) => {
      productCardProps(props)
      return React.createElement('div', { 'data-testid': 'custom-card' })
    }

    const { getAllByTestId, queryByTestId } = render(
      <CartRecommendationShelf
        campaignVrn={CAMPAIGN_VRN}
        ProductCard={CustomCard}
      />
    )

    expect(getAllByTestId('custom-card')).toHaveLength(2)
    expect(queryByTestId('product-card')).toBeNull()
  })
})
