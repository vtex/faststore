import type { AddToCartEvent } from '../../../src/analytics/events/add_to_cart'
import type { WrappedAnalyticsEvent } from '../../../src/analytics/wrap'

export interface CustomEvent {
  type: 'custom_event'
  data: {
    customDataProperty: string
  }
  customProperty: string
}

export const CUSTOM_EVENT_SAMPLE: CustomEvent = {
  type: 'custom_event',
  data: {
    customDataProperty: 'value',
  },
  customProperty: 'value',
}

export const WRAPPED_CUSTOM_EVENT_SAMPLE: WrappedAnalyticsEvent<CustomEvent> = {
  type: 'AnalyticsEvent',
  data: {
    type: 'store:custom_event',
    data: {
      customDataProperty: 'value',
    },
    customProperty: 'value',
  },
}

export const ADD_TO_CART_SAMPLE: AddToCartEvent = {
  type: 'add_to_cart',
  data: {
    items: [{ item_id: 'PRODUCT_ID' }],
  },
}

export const WRAPPED_ADD_TO_CART_SAMPLE: WrappedAnalyticsEvent<AddToCartEvent> = {
  type: 'AnalyticsEvent',
  data: {
    type: 'store:add_to_cart',
    data: {
      items: [{ item_id: 'PRODUCT_ID' }],
    },
  },
}
