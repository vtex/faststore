import '@testing-library/jest-dom/vitest'
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const usePDP = vi.hoisted(() => vi.fn())
vi.mock('@faststore/core', () => ({ usePDP }))

vi.mock('@faststore/ui', () => {
  const passthrough = ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children)
  return { ProductShelf: passthrough, Carousel: passthrough }
})

vi.mock('src/components/product/ProductCard', () => ({
  default: () => React.createElement('div', { 'data-testid': 'product-card' }),
}))

vi.mock('src/components/skeletons/ProductShelfSkeleton', () => ({
  default: ({
    children,
    loading,
  }: React.PropsWithChildren<{ loading?: boolean }>) =>
    React.createElement(
      'div',
      { 'data-testid': 'skeleton', 'data-loading': String(!!loading) },
      children
    ),
}))

const useRecommendations = vi.hoisted(() => vi.fn())
vi.mock(
  'src/components/sections/RecommendationShelf/useRecommendations',
  () => ({
    useRecommendations,
  })
)

const useScreenResize = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/ui/useScreenResize', () => ({ default: useScreenResize }))

const useRecommendationUserId = vi.hoisted(() => vi.fn())
vi.mock(
  'src/components/sections/RecommendationShelf/useRecommendationUserId',
  () => ({
    useRecommendationUserId,
  })
)

import { RecommendationShelf } from 'src/components/sections/RecommendationShelf/RecommendationShelf'

const CAMPAIGN_VRN = 'vrn:recommendations:acc:rec-top-items-v2:campaign-1'
const CROSS_SELL_VRN = 'vrn:recommendations:acc:rec-cross-v2:campaign-1'

const recommendationData = {
  products: [
    { id: 'p-1', isVariantOf: { productGroupID: 'p-1' } },
    { id: 'p-2', isVariantOf: { productGroupID: 'p-2' } },
  ],
  correlationId: 'corr-1',
  campaign: { id: 'camp-1', title: 'Recommended for you', type: 'TOP_ITEMS' },
}

beforeEach(() => {
  usePDP.mockReturnValue({ data: undefined })
  useScreenResize.mockReturnValue({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    loading: false,
  })
  useRecommendationUserId.mockReturnValue('user-1')
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('RecommendationShelf', () => {
  it('renders a product card per recommended product when enabled', async () => {
    useRecommendations.mockReturnValue({
      data: recommendationData,
      isLoading: false,
      error: null,
    })

    const { getAllByTestId, getByText } = render(
      <RecommendationShelf campaignVrn={CAMPAIGN_VRN} enableRecommendations />
    )

    await waitFor(() => {
      expect(getAllByTestId('product-card')).toHaveLength(2)
    })
    expect(getByText('Recommended for you')).toBeTruthy()
  })

  it('requests cross-sell recommendations using the current PDP product', async () => {
    usePDP.mockReturnValue({
      data: { product: { isVariantOf: { productGroupID: 'pg-1' } } },
    })
    useRecommendations.mockReturnValue({
      data: recommendationData,
      isLoading: false,
      error: null,
    })

    render(
      <RecommendationShelf campaignVrn={CROSS_SELL_VRN} enableRecommendations />
    )

    await waitFor(() => {
      const lastArgs = useRecommendations.mock.calls.at(-1)?.[0]
      expect(lastArgs).toEqual({
        userId: 'user-1',
        campaignVrn: CROSS_SELL_VRN,
        products: ['pg-1'],
      })
    })
  })

  it('prefers the provided title over the campaign title', async () => {
    useRecommendations.mockReturnValue({
      data: recommendationData,
      isLoading: false,
      error: null,
    })

    const { getByText } = render(
      <RecommendationShelf
        campaignVrn={CAMPAIGN_VRN}
        enableRecommendations
        title="Custom title"
      />
    )

    await waitFor(() => {
      expect(getByText('Custom title')).toBeTruthy()
    })
  })

  it('skips the fetch and renders empty when there is no resolved userId', async () => {
    useRecommendationUserId.mockReturnValue(null)
    useRecommendations.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    const { container, queryByTestId } = render(
      <RecommendationShelf campaignVrn={CAMPAIGN_VRN} enableRecommendations />
    )

    await waitFor(() => {
      const lastArgs = useRecommendations.mock.calls.at(-1)?.[0]
      expect(lastArgs).toBeNull()
    })
    expect(queryByTestId('product-card')).toBeNull()
    expect(container).toBeEmptyDOMElement()
  })

  it('skips the fetch when recommendations are disabled (default)', async () => {
    useRecommendations.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    const { container, queryByTestId } = render(
      <RecommendationShelf campaignVrn={CAMPAIGN_VRN} />
    )

    await waitFor(() => {
      const lastArgs = useRecommendations.mock.calls.at(-1)?.[0]
      expect(lastArgs).toBeNull()
    })
    expect(queryByTestId('product-card')).toBeNull()
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when there is an error', () => {
    useRecommendations.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('boom'),
    })

    const { container } = render(
      <RecommendationShelf campaignVrn={CAMPAIGN_VRN} enableRecommendations />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when there are no items and loading has finished', () => {
    useRecommendations.mockReturnValue({
      data: { ...recommendationData, products: [] },
      isLoading: false,
      error: null,
    })

    const { container, queryByTestId } = render(
      <RecommendationShelf campaignVrn={CAMPAIGN_VRN} enableRecommendations />
    )

    expect(queryByTestId('product-card')).toBeNull()
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the skeleton while loading', () => {
    useRecommendations.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { getByTestId } = render(
      <RecommendationShelf campaignVrn={CAMPAIGN_VRN} enableRecommendations />
    )

    expect(getByTestId('skeleton').getAttribute('data-loading')).toBe('true')
  })
})
