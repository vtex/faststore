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

const parseRawChannel = (channel: string | null | undefined) => {
  try {
    return JSON.parse(channel ?? '') ?? {}
  } catch {
    return {}
  }
}

export function salesChannelSourceOf(
  channel: string | null | undefined
): SalesChannelSource | undefined {
  const source = parseRawChannel(channel).salesChannelSource

  return source === 'orderForm' || source === 'url' ? source : undefined
}

/**
 * SC that Session Manager rejected (401/403) for this shopper after it was
 * adopted from the orderForm. validateCart must not adopt it again, otherwise
 * adoption and rejection would loop.
 */
export function rejectedSalesChannelOf(
  channel: string | null | undefined
): string | undefined {
  const rejected = parseRawChannel(channel).rejectedSalesChannel

  return typeof rejected === 'string' || typeof rejected === 'number'
    ? String(rejected) || undefined
    : undefined
}

/**
 * Builds the session `channel` string after Session Manager responds.
 *
 * Session Manager is the SC authority, except when the client channel carries
 * a `salesChannelSource` marker: then the client SC is kept and the marker is
 * re-emitted so it survives this validation. A recorded rejection is also
 * re-emitted until Session Manager resolves that SC for the shopper.
 */
export function channelAfterSessionManager(
  channel: Required<Channel>,
  storeChannelValue: string | null | undefined,
  regionId: string | null | undefined,
  sellerId: string | undefined,
  salesChannelSource?: SalesChannelSource,
  rejectedSalesChannel?: string
): string {
  const storeSalesChannel = storeChannelValue ?? undefined
  const resolvedRegionId = regionId ?? channel.regionId
  const salesChannel = salesChannelSource
    ? channel.salesChannel || storeSalesChannel
    : (storeSalesChannel ?? channel.salesChannel)
  const keepRejection =
    rejectedSalesChannel != null &&
    rejectedSalesChannel !== String(salesChannel ?? '')

  return ChannelMarshal.stringify({
    salesChannel,
    regionId: resolvedRegionId ?? undefined,
    seller: sellerId,
    hasOnlyDefaultSalesChannel: !storeSalesChannel,
    ...(salesChannelSource ? { salesChannelSource } : {}),
    ...(keepRejection ? { rejectedSalesChannel } : {}),
  })
}

/** Checkout answers with this SC when an orderForm request carries no `sc`. */
const PLATFORM_DEFAULT_SALES_CHANNEL = '1'

/**
 * SC to request from Session Manager. FastStore 4.6–4.9 could move a session
 * to the SC 1 fallback of an empty orderForm and pin it there. When an
 * unmarked session is on SC 1 but the store runs on another SC, ask for the
 * store SC instead: if Session Manager assigns SC 1 on purpose (e.g. by
 * profile), it still answers SC 1.
 */
export function salesChannelToRequest(
  channel: Required<Channel>,
  salesChannelSource: SalesChannelSource | undefined,
  storeSalesChannel: string | undefined,
  search: string
): string {
  const salesChannel = String(channel.salesChannel ?? '')
  const isStuckOnFallback =
    salesChannelSource === undefined &&
    salesChannel === PLATFORM_DEFAULT_SALES_CHANNEL &&
    !!storeSalesChannel &&
    storeSalesChannel !== PLATFORM_DEFAULT_SALES_CHANNEL &&
    !new URLSearchParams(search).has('sc')

  return isStuckOnFallback ? storeSalesChannel : salesChannel
}
