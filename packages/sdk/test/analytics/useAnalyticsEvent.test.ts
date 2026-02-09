import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAnalyticsEvent } from '../../src/analytics/useAnalyticsEvent'
import { wrap } from '../../src/analytics/wrap'
import { ADD_TO_CART_SAMPLE } from './__fixtures__/EventSamples'

describe('useAnalyticsEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('useAnalyticsEvent calls handler with correct params when an AnalyticsEvent is fired', async () => {
    const handler = vi.fn()

    vi.spyOn(window, 'addEventListener').mockImplementation((_, fn) => {
      if (typeof fn === 'function') {
        fn(new MessageEvent('message', { data: wrap(ADD_TO_CART_SAMPLE) }))
      }
    })

    renderHook(() => useAnalyticsEvent(handler))

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(ADD_TO_CART_SAMPLE)
  })

  it('useAnalyticsEvent ignores events that are not AnalyticsEvent', async () => {
    const handler = vi.fn()

    vi.spyOn(window, 'addEventListener').mockImplementation((_, fn) => {
      if (typeof fn === 'function') {
        fn(
          new MessageEvent('message', {
            data: { ...wrap(ADD_TO_CART_SAMPLE), name: 'OtherEventType' },
          })
        )
      }
    })

    renderHook(() => useAnalyticsEvent(handler))

    expect(handler).not.toHaveBeenCalled()
  })
})
