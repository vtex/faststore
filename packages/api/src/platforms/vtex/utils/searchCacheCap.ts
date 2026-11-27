import type { CacheControl } from '../../../directives/cacheControl'

type CapOffer = {
  PriceValidUntil?: string
  priceState?: unknown
}

type CapItem = {
  sellers?: Array<{
    commertialOffer?: CapOffer
  }>
}

const isPriceStateObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseSignaledValidUntil = (offer: CapOffer | undefined) => {
  if (!offer || !isPriceStateObject(offer.priceState)) {
    return
  }

  if (typeof offer.PriceValidUntil !== 'string') {
    return
  }

  const parsed = Date.parse(offer.PriceValidUntil)

  if (!Number.isFinite(parsed)) {
    return
  }

  return parsed
}

const earliestValidUntil = (items: CapItem[]) => {
  let earliest: number | undefined

  for (const item of items) {
    for (const seller of item?.sellers ?? []) {
      const parsed = parseSignaledValidUntil(seller?.commertialOffer)

      if (parsed === undefined) {
        continue
      }

      if (earliest === undefined || parsed < earliest) {
        earliest = parsed
      }
    }
  }

  return earliest
}

const lowerStoredNumber = (
  cacheControl: CacheControl,
  key: 'sMaxAge' | 'staleWhileRevalidate',
  ceiling: number,
  seconds: number
) => {
  const current = cacheControl[key]

  if (typeof current !== 'number') {
    return
  }

  cacheControl[key] = Math.min(current, Math.min(ceiling, seconds))
}

/**
 * Lowers sMaxAge and staleWhileRevalidate already stored on ctx.cacheControl
 * when a raw Intelligent Search offer carries a priceState object and a
 * parseable PriceValidUntil. Does not create a hint and does not change scope.
 *
 * `headers` is not read. It stops TypeScript from treating the argument as a
 * weak type, so GraphqlContext can be passed without declaring cacheControl.
 */
export const applySearchCacheCap = (
  ctx: { cacheControl?: CacheControl; headers?: unknown },
  items: CapItem[] | undefined,
  now = Date.now()
): void => {
  const cacheControl = ctx.cacheControl

  if (!cacheControl || !items?.length) {
    return
  }

  const earliest = earliestValidUntil(items)

  if (earliest === undefined) {
    return
  }

  const seconds = Math.max(0, Math.floor((earliest - now) / 1000))

  lowerStoredNumber(cacheControl, 'sMaxAge', 300, seconds)
  lowerStoredNumber(cacheControl, 'staleWhileRevalidate', 3600, seconds)
}
