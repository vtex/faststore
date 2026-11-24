/**
 * Repro: `onDeliveryFacetChange` leaves a stale `pickupPoint` facet in the
 * filter drawer's `selected` list when the shopper switches delivery methods
 * through `filterDispatch` (FilterSlider path).
 */
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const setSearchState = vi.fn()
const searchState = vi.hoisted(() => ({
  state: { selectedFacets: [] as { key: string; value: string }[] },
}))

vi.mock('discovery.config', () => ({
  deliveryPromise: { enabled: true },
}))

vi.mock('src/sdk/session', () => ({
  useSession: () => ({ postalCode: '01310100' }),
}))

vi.mock('src/sdk/deliveryPromise', () => ({
  initialPickupPointsSimulation: undefined,
  useDeliveryPromiseContext: () => ({
    pickupPoints: [{ id: 'pickup-1', name: 'Main St Store' }],
    defaultPickupPoint: { id: 'pickup-1', name: 'Main St Store' },
    globalPickupPoint: null,
    pickupPointsSimulation: undefined,
    dispatchDeliveryPromiseAction: vi.fn(),
    shouldUpdatePickupPoints: false,
  }),
}))

vi.mock('@faststore/sdk', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@faststore/sdk')>()

  return {
    ...actual,
    useSearch: () => ({
      state: searchState.state,
      setState: setSearchState,
    }),
  }
})

import { toggleFacets } from '@faststore/sdk'
import {
  PICKUP_IN_POINT_FACET_VALUE,
  useDeliveryPromise,
} from '../../../src/sdk/deliveryPromise/useDeliveryPromise'

const PICKUP_IN_POINT = {
  key: 'shipping',
  value: PICKUP_IN_POINT_FACET_VALUE,
}
const PICKUP_POINT = { key: 'pickupPoint', value: 'pickup-1' }
const DELIVERY = { key: 'shipping', value: 'delivery' }

/**
 * Applies a dispatched `toggleFacets` action to a facet list, like the
 * `useFilter` reducer does inside FilterSlider.
 */
function applyDispatched(
  dispatch: ReturnType<typeof vi.fn>,
  selected: { key: string; value: string }[]
) {
  const action = dispatch.mock.calls.at(-1)?.[0]

  return toggleFacets(selected, action.payload.facets, action.payload.unique)
}

describe('onDeliveryFacetChange via filterDispatch', () => {
  it('drops the stale pickupPoint facet when switching to delivery', () => {
    const selected = [PICKUP_IN_POINT, PICKUP_POINT]
    const filterDispatch = vi.fn()

    const { result } = renderHook(() =>
      useDeliveryPromise({ selectedFilterFacets: selected })
    )

    act(() => {
      result.current.onDeliveryFacetChange({
        facet: DELIVERY,
        filterDispatch,
      })
    })

    expect(filterDispatch).toHaveBeenCalledOnce()

    const next = applyDispatched(filterDispatch, selected)

    expect(next).toEqual([{ key: 'shipping', value: 'delivery' }])
  })

  it('keeps the pickup point when toggling back to pickup-in-point', () => {
    const selected = [PICKUP_IN_POINT, PICKUP_POINT]
    const dispatch = vi.fn()

    const { result, rerender } = renderHook(
      ({ selectedFilterFacets }) =>
        useDeliveryPromise({ selectedFilterFacets }),
      { initialProps: { selectedFilterFacets: selected } }
    )

    // 1. Shopper switches from pickup-in-point to delivery.
    act(() => {
      result.current.onDeliveryFacetChange({
        facet: DELIVERY,
        filterDispatch: dispatch,
      })
    })

    let current = applyDispatched(dispatch, selected)

    // 2. Shopper toggles back to pickup-in-point before applying.
    rerender({ selectedFilterFacets: current })

    act(() => {
      result.current.onDeliveryFacetChange({
        facet: PICKUP_IN_POINT,
        filterDispatch: dispatch,
      })
    })

    current = applyDispatched(dispatch, current)

    expect(current).toEqual([PICKUP_IN_POINT, PICKUP_POINT])
  })
})
