import { renderHook } from '@testing-library/react-hooks'

import { useAnalyticsEvent } from '../../src/analytics/useAnalyticsEvent'
import { wrap } from '../../src/analytics/wrap'
import type { AddToCartEvent } from '../../src/analytics/events/add_to_cart'

const eventSample: AddToCartEvent = {
  type: 'add_to_cart',
  data: {
    items: [{ item_id: 'PRODUCT_ID' }],
  },
}

describe('useAnalyticsEvent', () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('useAnalyticsEvent calls handler with correct params when an AnalyticsEvent is fired', async () => {
    const handler = jest.fn()

    jest.spyOn(window, 'addEventListener').mockImplementation((_, fn) => {
      if (typeof fn === 'function') {
        fn(new MessageEvent('message', { data: wrap(eventSample) }))
      }
    })

    renderHook(() => useAnalyticsEvent(handler))

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(eventSample)
  })

  it('useAnalyticsEvent ignores events that are not AnalyticsEvent', async () => {
    const handler = jest.fn()

    jest.spyOn(window, 'addEventListener').mockImplementation((_, fn) => {
      if (typeof fn === 'function') {
        fn(
          new MessageEvent('message', {
            data: { ...wrap(eventSample), type: 'OtherEventType' },
          })
        )
      }
    })

    renderHook(() => useAnalyticsEvent(handler))

    expect(handler).not.toHaveBeenCalled()
  })
})
