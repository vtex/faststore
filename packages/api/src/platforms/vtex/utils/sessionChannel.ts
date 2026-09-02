import type { Channel } from './channel'
import ChannelMarshal from './channel'

/**
 * Builds the session `channel` string after Session Manager responds.
 *
 * When the client already pinned an explicit SC (e.g. adopted from the
 * orderForm after Quick Order), keep it. Session Manager often still reports
 * the default SC and would otherwise overwrite the adoption.
 */
export function channelAfterSessionManager(
  channel: Required<Channel>,
  storeChannelValue: string | null | undefined,
  regionId: string | null | undefined,
  sellerId: string | undefined
): string {
  const hasExplicitSalesChannel = channel.hasOnlyDefaultSalesChannel === false

  const storeSalesChannel = storeChannelValue ?? undefined
  const resolvedRegionId = regionId ?? channel.regionId

  return ChannelMarshal.stringify({
    salesChannel: hasExplicitSalesChannel
      ? channel.salesChannel || storeSalesChannel
      : (storeSalesChannel ?? channel.salesChannel),
    regionId: resolvedRegionId ?? undefined,
    seller: sellerId,
    hasOnlyDefaultSalesChannel: hasExplicitSalesChannel
      ? false
      : !storeSalesChannel,
  })
}
