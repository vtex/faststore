import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const usePDP = vi.hoisted(() => vi.fn())
vi.mock('@faststore/core', () => ({ usePDP }))

const useCart = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/cart', () => ({ useCart }))

const useRecommendations = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/recommendations/useRecommendations', () => ({
  useRecommendations,
}))

const useRecommendationUserId = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/recommendations/useRecommendationUserId', () => ({
  useRecommendationUserId,
}))

import { useRecommendationShelf } from 'src/sdk/recommendations/useRecommendationShelf'

const TOP_ITEMS_VRN = 'vrn:recommendations:acc:rec-top-items-v2:campaign-1'
const CROSS_SELL_VRN = 'vrn:recommendations:acc:rec-cross-v2:campaign-1'

const cartItem = (productGroupID: string) => ({
  itemOffered: { isVariantOf: { productGroupID } },
})

const campaignData = {
  products: [
    { id: 'p-1', isVariantOf: { productGroupID: 'p-1' } },
    { id: 'p-2', isVariantOf: { productGroupID: 'p-2' } },
  ],
  correlationId: 'corr-1',
  campaign: { id: 'camp-1', title: 'Recommended for you', type: 'TOP_ITEMS' },
}

const lastArgs = () => useRecommendations.mock.calls.at(-1)?.[0]

beforeEach(() => {
  usePDP.mockReturnValue({ data: undefined })
  useCart.mockReturnValue({ items: [] })
  useRecommendationUserId.mockReturnValue('user-1')
  useRecommendations.mockReturnValue({
    data: campaignData,
    isLoading: false,
    error: null,
  })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useRecommendationShelf', () => {
  it('exposes the campaign payload when enabled', () => {
    const { result } = renderHook(() =>
      useRecommendationShelf({
        campaignVrn: TOP_ITEMS_VRN,
        enableRecommendations: true,
      })
    )

    expect(result.current.items).toHaveLength(2)
    expect(result.current.campaign?.title).toBe('Recommended for you')
    expect(result.current.correlationId).toBe('corr-1')
  })

  it('never fetches while recommendations are disabled', () => {
    renderHook(() => useRecommendationShelf({ campaignVrn: TOP_ITEMS_VRN }))

    expect(lastArgs()).toBeNull()
  })

  it('never fetches before a userId resolves', () => {
    useRecommendationUserId.mockReturnValue(null)

    renderHook(() =>
      useRecommendationShelf({
        campaignVrn: TOP_ITEMS_VRN,
        enableRecommendations: true,
      })
    )

    expect(lastArgs()).toBeNull()
  })

  it('never fetches on a malformed campaign vrn', () => {
    renderHook(() =>
      useRecommendationShelf({
        campaignVrn: 'not-a-vrn',
        enableRecommendations: true,
      })
    )

    expect(lastArgs()).toBeNull()
  })

  it('anchors cart-context campaigns on the deduplicated cart products', () => {
    useCart.mockReturnValue({
      items: [cartItem('pg-1'), cartItem('pg-2'), cartItem('pg-1')],
    })

    renderHook(() =>
      useRecommendationShelf({
        campaignVrn: CROSS_SELL_VRN,
        enableRecommendations: true,
        itemsContext: 'CART',
      })
    )

    expect(lastArgs()).toEqual({
      userId: 'user-1',
      campaignVrn: CROSS_SELL_VRN,
      products: ['pg-1', 'pg-2'],
    })
  })

  it('skips cart-context campaigns while the cart is empty', () => {
    renderHook(() =>
      useRecommendationShelf({
        campaignVrn: CROSS_SELL_VRN,
        enableRecommendations: true,
        itemsContext: 'CART',
      })
    )

    expect(lastArgs()).toBeNull()
  })

  it('still fetches context-agnostic campaigns on an empty cart', () => {
    renderHook(() =>
      useRecommendationShelf({
        campaignVrn: TOP_ITEMS_VRN,
        enableRecommendations: true,
        itemsContext: 'CART',
      })
    )

    expect(lastArgs()).toEqual({
      userId: 'user-1',
      campaignVrn: TOP_ITEMS_VRN,
      products: [],
    })
  })

  it('follows the live cart context when not frozen', () => {
    useCart.mockReturnValue({ items: [cartItem('pg-1')] })

    const { rerender } = renderHook(() =>
      useRecommendationShelf({
        campaignVrn: CROSS_SELL_VRN,
        enableRecommendations: true,
        itemsContext: 'CART',
      })
    )

    useCart.mockReturnValue({ items: [cartItem('pg-1'), cartItem('pg-2')] })
    rerender()

    expect(lastArgs()?.products).toEqual(['pg-1', 'pg-2'])
  })

  it('keeps the context stable when frozen, so adding to cart does not refetch', () => {
    useCart.mockReturnValue({ items: [cartItem('pg-1')] })

    const { rerender } = renderHook(() =>
      useRecommendationShelf({
        campaignVrn: CROSS_SELL_VRN,
        enableRecommendations: true,
        itemsContext: 'CART',
        freezeContext: true,
      })
    )

    useCart.mockReturnValue({ items: [cartItem('pg-1'), cartItem('pg-2')] })
    rerender()

    expect(lastArgs()?.products).toEqual(['pg-1'])
  })

  it('does not freeze an empty context while the cart is still loading', () => {
    const { rerender } = renderHook(() =>
      useRecommendationShelf({
        campaignVrn: CROSS_SELL_VRN,
        enableRecommendations: true,
        itemsContext: 'CART',
        freezeContext: true,
      })
    )

    expect(lastArgs()).toBeNull()

    useCart.mockReturnValue({ items: [cartItem('pg-9')] })
    rerender()

    expect(lastArgs()?.products).toEqual(['pg-9'])
  })

  it('anchors PDP-context campaigns on the current product', () => {
    usePDP.mockReturnValue({
      data: { product: { isVariantOf: { productGroupID: 'pg-pdp' } } },
    })

    renderHook(() =>
      useRecommendationShelf({
        campaignVrn: CROSS_SELL_VRN,
        enableRecommendations: true,
      })
    )

    expect(lastArgs()?.products).toEqual(['pg-pdp'])
  })

  it('returns no items and logs without the userId on error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    useRecommendations.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('boom'),
    })

    const { result } = renderHook(() =>
      useRecommendationShelf({
        campaignVrn: TOP_ITEMS_VRN,
        enableRecommendations: true,
      })
    )

    expect(result.current.items).toEqual([])
    expect(result.current.error).toBeInstanceOf(Error)
    expect(consoleError).toHaveBeenCalled()
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('user-1')
  })
})
