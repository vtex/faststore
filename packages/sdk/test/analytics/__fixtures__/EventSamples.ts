import type { AddToCartEvent } from '../../../src/analytics/events/add_to_cart'
import type { WrappedAnalyticsEvent } from '../../../src/analytics/wrap'

export interface CustomEvent {
  name: 'custom_event'
  params: {
    customParam: string
  }
  customProperty: string
}

export const CUSTOM_EVENT_SAMPLE: CustomEvent = {
  name: 'custom_event',
  params: {
    customParam: 'value',
  },
  customProperty: 'value',
}

export const WRAPPED_CUSTOM_EVENT_SAMPLE: WrappedAnalyticsEvent<CustomEvent> = {
  name: 'AnalyticsEvent',
  params: {
    name: 'store:custom_event',
    params: {
      customParam: 'value',
    },
    customProperty: 'value',
  },
}

export const ADD_TO_CART_SAMPLE: AddToCartEvent = {
  name: 'add_to_cart',
  params: {
    items: [{ item_id: 'PRODUCT_ID' }],
  },
}

export const WRAPPED_ADD_TO_CART_SAMPLE: WrappedAnalyticsEvent<AddToCartEvent> =
  {
    name: 'AnalyticsEvent',
    params: {
      name: 'store:add_to_cart',
      params: {
        items: [{ item_id: 'PRODUCT_ID' }],
      },
    },
  }
