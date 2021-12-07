import { wrap, unwrap } from '../../src/analytics/wrap'
import { ADD_TO_CART_SAMPLE } from './__fixtures__/EventSamples'

describe('wrap and unwrap functions', () => {
  it('wrap function wraps event with AnalyticsEvent name', () => {
    const { name } = wrap(ADD_TO_CART_SAMPLE)

    expect(name).toBe('AnalyticsEvent')
  })

  it('wrap function prefixes the event name', () => {
    const wrappedEvent = wrap(ADD_TO_CART_SAMPLE)
    const { name: wrappedEventType } = wrappedEvent.params
    const { name: originalType } = ADD_TO_CART_SAMPLE

    expect(wrappedEventType).toBe(`store:${originalType}`)
  })

  it('wrap function preserves all event properties but the name', () => {
    const wrappedEvent = wrap(ADD_TO_CART_SAMPLE)
    const { name: _, ...wrappedEventRest } = wrappedEvent.params
    const { name: __, ...originalEventRest } = ADD_TO_CART_SAMPLE

    expect(wrappedEventRest).toStrictEqual(originalEventRest)
  })

  it('unwrap function preserves the original event', () => {
    const wrappedEvent = wrap(ADD_TO_CART_SAMPLE)
    const unwrappedEvent = unwrap(wrappedEvent) ?? {}

    expect(unwrappedEvent).toStrictEqual(ADD_TO_CART_SAMPLE)
  })
})
