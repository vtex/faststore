import type { Channel } from './channel'
import ChannelMarshal from './channel'

/**
 * Why the session SC must not be replaced by Session Manager:
 * - `orderForm`: adopted from an orderForm with items (e.g. after Quick Order);
 *   kept until the cart is empty.
 * - `url`: derived from the URL by localization; always sent to Checkout.
 *
 * Lives only in the raw `channel` JSON string so the public `Channel` type
 * stays unchanged.
 */
export type SalesChannelSource = 'orderForm' | 'url'

export function salesChannelSourceOf(
  channel: string | null | undefined
): SalesChannelSource | undefined {
  try {
    const source = JSON.parse(channel ?? '')?.salesChannelSource

    return source === 'orderForm' || source === 'url' ? source : undefined
  } catch {
    return undefined
  }
}

/**
 * Builds the session `channel` string after Session Manager responds.
 *
 * Session Manager is the SC authority, except when the client channel carries
 * a `salesChannelSource` marker: then the client SC is kept and the marker is
 * re-emitted so it survives this validation.
 */
export function channelAfterSessionManager(
  channel: Required<Channel>,
  storeChannelValue: string | null | undefined,
  regionId: string | null | undefined,
  sellerId: string | undefined,
  salesChannelSource?: SalesChannelSource
): string {
  const storeSalesChannel = storeChannelValue ?? undefined
  const resolvedRegionId = regionId ?? channel.regionId

  return ChannelMarshal.stringify({
    salesChannel: salesChannelSource
      ? channel.salesChannel || storeSalesChannel
      : (storeSalesChannel ?? channel.salesChannel),
    regionId: resolvedRegionId ?? undefined,
    seller: sellerId,
    hasOnlyDefaultSalesChannel: !storeSalesChannel,
    ...(salesChannelSource ? { salesChannelSource } : {}),
  })
}
