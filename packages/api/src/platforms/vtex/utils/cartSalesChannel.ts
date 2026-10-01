import type { OrderForm } from '../clients/commerce/types/OrderForm'
import type { Channel } from './channel'
import ChannelMarshal from './channel'

/**
 * When session SC and orderForm SC diverge, keep Checkout on the orderForm
 * trade policy. Used after external cart changes (stale etag / Quick Order) and
 * on later validations while the browser session still lags.
 *
 * Forcing the session SC (refetch / item updates with `sc=session`) would drop
 * items that exist only on the orderForm's sales channel.
 */
export function channelWhenSessionDivergesFromOrderForm(
  currentChannel: Required<Channel>,
  orderFormSalesChannel: string | null | undefined
): string | null {
  if (orderFormSalesChannel == null || orderFormSalesChannel === '') {
    return null
  }

  if (
    String(orderFormSalesChannel) === String(currentChannel.salesChannel ?? '')
  ) {
    return null
  }

  return ChannelMarshal.stringify({
    ...currentChannel,
    salesChannel: String(orderFormSalesChannel),
    hasOnlyDefaultSalesChannel: false,
  })
}

/**
 * Checkout stores an SC on the orderForm only after an items mutation sent
 * with `sc`. An SC-less request on an orderForm that never had items falls
 * back to the platform default (SC 1), so its SC is meaningful only when the
 * orderForm has items or already matches the session.
 */
export function shouldTrustOrderFormSalesChannel(
  orderForm: Pick<OrderForm, 'items' | 'salesChannel'>,
  sessionSalesChannel: string
): boolean {
  if (orderForm.items.length > 0) {
    return true
  }

  if (orderForm.salesChannel == null || orderForm.salesChannel === '') {
    return false
  }

  return String(orderForm.salesChannel) === String(sessionSalesChannel ?? '')
}
