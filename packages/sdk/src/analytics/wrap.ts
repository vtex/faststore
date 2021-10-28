import type { ShareEvent } from './events/share'
import type { SearchEvent } from './events/search'
import type { SignupEvent } from './events/signup'
import type { LoginEvent } from './events/login'
import type { RefundEvent } from './events/refund'
import type { PurchaseEvent } from './events/purchase'
import type { AddShippingInfoEvent } from './events/add_shipping_info'
import type { AddPaymentInfoEvent } from './events/add_payment_info'
import type { BeginCheckoutEvent } from './events/begin_checkout'
import type { ViewCartEvent } from './events/view_cart'
import type { RemoveFromCartEvent } from './events/remove_from_cart'
import type { AddToCartEvent } from './events/add_to_cart'
import type { SelectItemEvent } from './events/select_item'
import type { AddToWishlistEvent } from './events/add_to_wishlist'
import type { SelectPromotionEvent } from './events/select_promotion'
import type { ViewPromotionEvent } from './events/view_promotion'
import type { ViewItemEvent } from './events/view_item'
import type { ViewItemListEvent } from './events/view_item_list'

/**
 * All these events are based on the official GA4 docs. https://developers.google.com/gtagjs/reference/ga4-events
 */
export type AnalyticsEvent =
  | ViewItemListEvent
  | ViewItemEvent
  | SelectItemEvent
  | ViewPromotionEvent
  | SelectPromotionEvent
  | AddToWishlistEvent
  | AddToCartEvent
  | RemoveFromCartEvent
  | ViewCartEvent
  | BeginCheckoutEvent
  | AddPaymentInfoEvent
  | AddShippingInfoEvent
  | PurchaseEvent
  | RefundEvent
  | SearchEvent
  | LoginEvent
  | SignupEvent
  | ShareEvent

export interface UnknownEvent {
  type: string
  data: unknown
}

export type WrappedAnalyticsEventData<T extends UnknownEvent> = Omit<
  T,
  'type'
> & {
  // Sadly tsdx doesn't support typescript 4.x yet. We should change this type to this when it does:
  // type: `store:${T['type']}`
  type: string
}

export interface WrappedAnalyticsEvent<T extends UnknownEvent> {
  type: 'AnalyticsEvent'
  data: WrappedAnalyticsEventData<T>
}

export const STORE_EVENT_PREFIX = 'store:'
export const ANALYTICS_EVENT_TYPE = 'AnalyticsEvent'

export const wrap = <T extends UnknownEvent>(
  event: T
): WrappedAnalyticsEvent<T> =>
  ({
    type: ANALYTICS_EVENT_TYPE,
    data: {
      ...event,
      type: `${STORE_EVENT_PREFIX}${event.type}`,
    },
  } as WrappedAnalyticsEvent<T>)

export const unwrap = <T extends UnknownEvent>(
  event: WrappedAnalyticsEvent<T>
): T => {
  return {
    ...event.data,
    type: event.data.type.slice(
      STORE_EVENT_PREFIX.length,
      event.data.type.length
    ),
  } as T
}
