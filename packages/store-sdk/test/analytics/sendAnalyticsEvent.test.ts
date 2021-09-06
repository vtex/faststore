import { sendAnalyticsEvent } from '../../src/analytics/sendAnalyticsEvent'
import type { AddToCartEvent } from '../../src/analytics/events/add_to_cart'
import type { WrappedAnalyticsEvent } from '../../src/analytics/wrap'

interface CustomEvent {
  type: 'custom_event'
  data: {
    customDataProperty: string
  }
  customProperty: string
}

const eventCustomSample: CustomEvent = {
  type: 'custom_event',
  data: {
    customDataProperty: 'value',
  },
  customProperty: 'value',
}

const wrappedCustomEventSample: WrappedAnalyticsEvent<CustomEvent> = {
  type: 'AnalyticsEvent',
  data: {
    type: 'store:custom_event',
    data: {
      customDataProperty: 'value',
    },
    customProperty: 'value',
  },
}

const eventSample: AddToCartEvent = {
  type: 'add_to_cart',
  data: {
    items: [{ item_id: 'PRODUCT_ID' }],
  },
}

const wrappedEventSample: WrappedAnalyticsEvent<AddToCartEvent> = {
  type: 'AnalyticsEvent',
  data: {
    type: 'store:add_to_cart',
    data: {
      items: [{ item_id: 'PRODUCT_ID' }],
    },
  },
}

const noop = () => {}
const origin = 'http://localhost:8080/'

describe('sendAnalyticsEvent', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('window.postMessage is called with correct params', () => {
    const postMessageSpy = jest
      .spyOn(window, 'postMessage')
      .mockImplementation(noop)

    Object.defineProperty(window, 'origin', {
      writable: false,
      value: origin,
    })

    sendAnalyticsEvent(eventSample)

    expect(postMessageSpy).toHaveBeenCalled()
    expect(postMessageSpy).toHaveBeenCalledWith(wrappedEventSample, origin)
  })

  it('sendAnalyticsEvent is able to send custom events', () => {
    const postMessageSpy = jest
      .spyOn(window, 'postMessage')
      .mockImplementation(noop)

    Object.defineProperty(window, 'origin', {
      writable: false,
      value: origin,
    })

    sendAnalyticsEvent<CustomEvent>(eventCustomSample)

    expect(postMessageSpy).toHaveBeenCalled()
    expect(postMessageSpy).toHaveBeenCalledWith(
      wrappedCustomEventSample,
      origin
    )
  })
})
