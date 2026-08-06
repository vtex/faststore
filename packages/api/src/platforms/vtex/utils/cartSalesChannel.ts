import type { Channel } from './channel'
import ChannelMarshal from './channel'

/**
 * When another system changed the orderForm (stale cartEtag), the orderForm's
 * sales channel is authoritative. Returns a channel string to apply via
 * `mutateChannelContext`, or `null` when no adoption is needed.
 */
export function channelAfterExternalOrderFormSync(
  currentChannel: Required<Channel>,
  orderFormSalesChannel: string | null | undefined,
  isOrderFormStale: boolean
): string | null {
  if (!isOrderFormStale) {
    return null
  }

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
 * After a non-stale validation, the session owns the channel. If session SC
 * differs from the orderForm's SC (e.g. locale/binding switch), the cart must
 * be re-fetched with the session SC so Checkout recalculates under the new
 * trade policy.
 */
export function shouldRefetchOrderFormWithSessionSalesChannel(
  sessionSalesChannel: string | undefined,
  orderFormSalesChannel: string | null | undefined,
  isOrderFormStale: boolean
): boolean {
  if (isOrderFormStale) {
    return false
  }

  if (!sessionSalesChannel || !orderFormSalesChannel) {
    return false
  }

  return String(sessionSalesChannel) !== String(orderFormSalesChannel)
}
