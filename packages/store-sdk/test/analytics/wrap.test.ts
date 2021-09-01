// import React from 'react'
// import { act, renderHook } from '@testing-library/react-hooks'

import { wrap, unwrap } from '../../src/analytics/wrap'
import type { AddToCartEvent } from '../../src/analytics/events/add_to_cart'

const eventSample: AddToCartEvent = {
  type: 'add_to_cart',
  data: {
    items: [{ item_id: 'PRODUCT_ID' }],
  },
}

describe('wrap and unwrap functions', () => {
  it('wrap function wraps event with AnalyticsEvent type', () => {
    const { type } = wrap(eventSample)

    expect(type).toBe('AnalyticsEvent')
  })

  it('wrap function prefixes the event type', () => {
    const wrappedEvent = wrap(eventSample)
    const { type: wrappedEventType } = wrappedEvent.data
    const { type: originalType } = eventSample

    expect(wrappedEventType).toBe(`store:${originalType}`)
  })

  it('wrap function preserves all event data but the type', () => {
    const wrappedEvent = wrap(eventSample)
    const { type: _, ...wrappedEventRest } = wrappedEvent.data
    const { type: __, ...originalEventRest } = eventSample

    expect(wrappedEventRest).toStrictEqual(originalEventRest)
  })

  it('unwrap function preserves the original event', () => {
    const wrappedEvent = wrap(eventSample)
    const unwrappedEvent = unwrap(wrappedEvent) ?? {}

    expect(unwrappedEvent).toStrictEqual(eventSample)
  })
})
