import { wrap, unwrap } from '../../src/analytics/wrap'
import { ADD_TO_CART_SAMPLE } from './__fixtures__/EventSamples'

describe('wrap and unwrap functions', () => {
  it('wrap function wraps event with AnalyticsEvent type', () => {
    const { type } = wrap(ADD_TO_CART_SAMPLE)

    expect(type).toBe('AnalyticsEvent')
  })

  it('wrap function prefixes the event type', () => {
    const wrappedEvent = wrap(ADD_TO_CART_SAMPLE)
    const { type: wrappedEventType } = wrappedEvent.data
    const { type: originalType } = ADD_TO_CART_SAMPLE

    expect(wrappedEventType).toBe(`store:${originalType}`)
  })

  it('wrap function preserves all event data but the type', () => {
    const wrappedEvent = wrap(ADD_TO_CART_SAMPLE)
    const { type: _, ...wrappedEventRest } = wrappedEvent.data
    const { type: __, ...originalEventRest } = ADD_TO_CART_SAMPLE

    expect(wrappedEventRest).toStrictEqual(originalEventRest)
  })

  it('unwrap function preserves the original event', () => {
    const wrappedEvent = wrap(ADD_TO_CART_SAMPLE)
    const unwrappedEvent = unwrap(wrappedEvent) ?? {}

    expect(unwrappedEvent).toStrictEqual(ADD_TO_CART_SAMPLE)
  })
})
