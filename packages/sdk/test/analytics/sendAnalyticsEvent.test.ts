import { sendAnalyticsEvent } from '../../src/analytics/sendAnalyticsEvent'
import type { CustomEvent } from './__fixtures__/EventSamples'
import {
  CUSTOM_EVENT_SAMPLE,
  ADD_TO_CART_SAMPLE,
  WRAPPED_CUSTOM_EVENT_SAMPLE,
  WRAPPED_ADD_TO_CART_SAMPLE,
} from './__fixtures__/EventSamples'

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

    sendAnalyticsEvent(ADD_TO_CART_SAMPLE)

    expect(postMessageSpy).toHaveBeenCalled()
    expect(postMessageSpy).toHaveBeenCalledWith(
      WRAPPED_ADD_TO_CART_SAMPLE,
      origin
    )
  })

  it('sendAnalyticsEvent is able to send custom events', () => {
    const postMessageSpy = jest
      .spyOn(window, 'postMessage')
      .mockImplementation(noop)

    Object.defineProperty(window, 'origin', {
      writable: false,
      value: origin,
    })

    sendAnalyticsEvent<CustomEvent>(CUSTOM_EVENT_SAMPLE)

    expect(postMessageSpy).toHaveBeenCalled()
    expect(postMessageSpy).toHaveBeenCalledWith(
      WRAPPED_CUSTOM_EVENT_SAMPLE,
      origin
    )
  })
})
