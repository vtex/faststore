/**
 * @vitest-environment jsdom
 */
import { act, render, waitFor } from '@testing-library/react'
import type { Dispatch } from 'react'
import { useEffect } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { DeliveryPromiseReducerAction } from '../../../src/sdk/deliveryPromise/reducer'

const { getPickupPoints, session } = vi.hoisted(() => ({
  getPickupPoints: vi.fn(),
  session: {
    postalCode: '01310100' as string | null,
    country: 'BRA' as string | null,
    channel: '{"salesChannel":"1"}' as string | null,
    geoCoordinates: { latitude: -23.5, longitude: -46.6 } as {
      latitude: number
      longitude: number
    } | null,
  },
}))

vi.mock('src/sdk/session', () => ({
  useSession: () => session,
}))

vi.mock('../../../src/sdk/deliveryPromise/queries', () => ({
  getPickupPoints,
}))

import {
  DeliveryPromiseProvider,
  useDeliveryPromiseContext,
} from '../../../src/sdk/deliveryPromise/provider'
import { deliveryPromiseStore } from '../../../src/sdk/deliveryPromise/useDeliveryPromise'

// Mirrors the store → reducer subscription in useDeliveryPromise.
// This suite does not cover that hook: if the hook stops syncing, these tests still pass.
function StoreSync() {
  const { dispatchDeliveryPromiseAction } = useDeliveryPromiseContext()

  useEffect(() => {
    return deliveryPromiseStore.subscribe((storeValue) => {
      dispatchDeliveryPromiseAction({
        type: 'updateDeliveryPromiseState',
        payload: storeValue,
      })
    })
  }, [dispatchDeliveryPromiseAction])

  return null
}

function renderProvider(
  onDispatch: (dispatch: Dispatch<DeliveryPromiseReducerAction>) => void,
  onLoadingFlag?: (shouldUpdatePickupPoints: boolean) => void
) {
  return render(
    <DeliveryPromiseProvider>
      <StoreSync />
      <DispatchBridge onDispatch={onDispatch} />
      {onLoadingFlag ? <LoadingFlagProbe onFlag={onLoadingFlag} /> : null}
    </DeliveryPromiseProvider>
  )
}

function LoadingFlagProbe({
  onFlag,
}: {
  onFlag: (shouldUpdatePickupPoints: boolean) => void
}) {
  const { shouldUpdatePickupPoints } = useDeliveryPromiseContext()

  useEffect(() => {
    onFlag(shouldUpdatePickupPoints)
  }, [onFlag, shouldUpdatePickupPoints])

  return null
}

function DispatchBridge({
  onDispatch,
}: {
  onDispatch: (dispatch: Dispatch<DeliveryPromiseReducerAction>) => void
}) {
  const { dispatchDeliveryPromiseAction } = useDeliveryPromiseContext()

  useEffect(() => {
    onDispatch(dispatchDeliveryPromiseAction)
  }, [dispatchDeliveryPromiseAction, onDispatch])

  return null
}

function deferred<T>() {
  let resolve: (value: T) => void = () => {}
  let reject: (error: unknown) => void = () => {}
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('DeliveryPromiseProvider pickup fetch', () => {
  let dispatch: Dispatch<DeliveryPromiseReducerAction> = () => {}
  const captureDispatch = (next: Dispatch<DeliveryPromiseReducerAction>) => {
    dispatch = next
  }

  beforeEach(() => {
    getPickupPoints.mockReset()
    session.postalCode = '01310100'
    session.country = 'BRA'
    session.channel = '{"salesChannel":"1"}'
    session.geoCoordinates = { latitude: -23.5, longitude: -46.6 }
    deliveryPromiseStore.set({
      pickupPoints: [],
      defaultPickupPoint: null,
      globalPickupPoint: null,
      shouldUpdatePickupPoints: false,
      simulatePickupPoints: false,
      pickupPointsSimulation: {
        pickupPoints: [],
        geoCoordinates: null,
        postalCode: null,
        country: null,
      },
    })
  })

  it('loads pickup points for the shopper channel', async () => {
    getPickupPoints.mockResolvedValueOnce([
      { id: 'vendemo_sp', name: 'VTEX SP' },
    ])

    renderProvider(captureDispatch)

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: false,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(deliveryPromiseStore.read()?.pickupPoints).toEqual([
        { id: 'vendemo_sp', name: 'VTEX SP' },
      ])
    })
    expect(getPickupPoints).toHaveBeenCalledWith({
      geoCoordinates: session.geoCoordinates,
      postalCode: '01310100',
      country: 'BRA',
      channel: '{"salesChannel":"1"}',
    })
  })

  it('keeps the newer response when the channel changes mid-request', async () => {
    const first = deferred<Array<{ id: string; name: string }>>()
    const second = deferred<Array<{ id: string; name: string }>>()
    getPickupPoints
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise)

    const view = renderProvider(captureDispatch)

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: false,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    session.channel = '{"salesChannel":"2"}'
    view.rerender(
      <DeliveryPromiseProvider>
        <StoreSync />
        <DispatchBridge onDispatch={captureDispatch} />
      </DeliveryPromiseProvider>
    )

    await waitFor(() => {
      expect(getPickupPoints).toHaveBeenCalledTimes(2)
    })

    await act(async () => {
      second.resolve([{ id: 'vendemo_rio', name: 'VTEX Rio' }])
    })
    await act(async () => {
      first.resolve([{ id: 'vendemo_stale', name: 'Stale' }])
    })

    await waitFor(() => {
      expect(deliveryPromiseStore.read()?.pickupPoints).toEqual([
        { id: 'vendemo_rio', name: 'VTEX Rio' },
      ])
    })
    expect(getPickupPoints).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ channel: '{"salesChannel":"2"}' })
    )
  })

  it('drops a response that arrives after the postal code is cleared', async () => {
    const pending = deferred<Array<{ id: string; name: string }>>()
    getPickupPoints.mockImplementationOnce(() => pending.promise)

    const view = renderProvider(captureDispatch)

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: false,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(getPickupPoints).toHaveBeenCalledTimes(1)
    })

    session.postalCode = null
    view.rerender(
      <DeliveryPromiseProvider>
        <StoreSync />
        <DispatchBridge onDispatch={captureDispatch} />
      </DeliveryPromiseProvider>
    )

    await act(async () => {
      pending.resolve([{ id: 'vendemo_stale', name: 'Stale' }])
    })

    expect(deliveryPromiseStore.read()?.pickupPoints).toEqual([])
  })

  it('clears the loading flag after a failed request and retries on the next update', async () => {
    getPickupPoints
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce([{ id: 'vendemo_sp', name: 'VTEX SP' }])

    let shouldUpdatePickupPoints = true
    renderProvider(captureDispatch, (flag) => {
      shouldUpdatePickupPoints = flag
    })

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: false,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(getPickupPoints).toHaveBeenCalledTimes(1)
    })
    await waitFor(() => {
      expect(shouldUpdatePickupPoints).toBe(false)
    })

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: false,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(deliveryPromiseStore.read()?.pickupPoints).toEqual([
        { id: 'vendemo_sp', name: 'VTEX SP' },
      ])
    })
    expect(getPickupPoints).toHaveBeenCalledTimes(2)
  })

  it('stores a simulated postal code without replacing the session list', async () => {
    getPickupPoints.mockResolvedValueOnce([
      { id: 'vendemo_rio', name: 'VTEX Rio' },
    ])

    renderProvider(captureDispatch)

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: true,
          validatedSession: {
            postalCode: '22041080',
            country: 'BRA',
            geoCoordinates: { latitude: -22.95, longitude: -43.19 },
          },
        },
      })
    })

    await waitFor(() => {
      expect(
        deliveryPromiseStore.read()?.pickupPointsSimulation?.pickupPoints
      ).toEqual([{ id: 'vendemo_rio', name: 'VTEX Rio' }])
    })
    expect(getPickupPoints).toHaveBeenCalledWith(
      expect.objectContaining({
        postalCode: '22041080',
        country: 'BRA',
        geoCoordinates: { latitude: -22.95, longitude: -43.19 },
      })
    )
    expect(deliveryPromiseStore.read()?.pickupPoints).toEqual([])
  })

  it('clears the simulated list when the next postal code fails', async () => {
    getPickupPoints
      .mockResolvedValueOnce([{ id: 'vendemo_sp', name: 'VTEX SP' }])
      .mockRejectedValueOnce(new Error('network'))

    renderProvider(captureDispatch)

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: true,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(
        deliveryPromiseStore.read()?.pickupPointsSimulation?.pickupPoints
      ).toEqual([{ id: 'vendemo_sp', name: 'VTEX SP' }])
    })

    await act(async () => {
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: true,
          validatedSession: { postalCode: '22041080', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(
        deliveryPromiseStore.read()?.pickupPointsSimulation?.pickupPoints
      ).toEqual([])
    })
    expect(deliveryPromiseStore.read()?.pickupPoints).toEqual([])
    expect(deliveryPromiseStore.read()?.shouldUpdatePickupPoints).toBe(false)
  })

  it('keeps the selected store when it is still in the new list', async () => {
    const point = { id: 'vendemo_sp', name: 'VTEX SP' }
    getPickupPoints.mockResolvedValueOnce([point])

    renderProvider(captureDispatch)

    await act(async () => {
      dispatch({ type: 'changeGlobalPickupPoint', payload: point })
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: false,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(deliveryPromiseStore.read()?.globalPickupPoint).toEqual(point)
    })
  })

  it('clears the selected store when it is missing from the new list', async () => {
    getPickupPoints.mockResolvedValueOnce([
      { id: 'vendemo_rio', name: 'VTEX Rio' },
    ])

    renderProvider(captureDispatch)

    await act(async () => {
      dispatch({
        type: 'changeGlobalPickupPoint',
        payload: { id: 'vendemo_sp', name: 'VTEX SP' },
      })
      dispatch({
        type: 'onPostalCodeChange',
        payload: {
          simulatePickupPoints: false,
          validatedSession: { postalCode: '01310100', country: 'BRA' },
        },
      })
    })

    await waitFor(() => {
      expect(deliveryPromiseStore.read()?.globalPickupPoint).toBeNull()
    })
  })

  it('does not rewrite the list when the fetched points are unchanged', async () => {
    const point = { id: 'vendemo_sp', name: 'VTEX SP' }
    getPickupPoints.mockResolvedValueOnce([point])

    renderProvider(captureDispatch)

    await act(async () => {
      dispatch({
        type: 'updatePickupPoints',
        payload: {
          pickupPoints: [point],
          shouldUpdatePickupPoints: true,
        },
      })
    })

    await waitFor(() => {
      expect(getPickupPoints).toHaveBeenCalledTimes(1)
    })
    expect(deliveryPromiseStore.read()?.pickupPoints).toEqual([])
  })
})
