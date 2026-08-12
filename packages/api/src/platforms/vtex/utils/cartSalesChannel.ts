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
 * When session SC and orderForm SC diverge, keep Checkout operations on the
 * orderForm trade policy. Forcing the session SC (refetch / item updates with
 * `sc=session`) reintroduces the Quick Order wipe after the first stale sync.
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
