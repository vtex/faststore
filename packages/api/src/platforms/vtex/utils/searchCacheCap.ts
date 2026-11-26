import type { CacheControl } from '../../../directives/cacheControl'

type CapItem = {
  sellers?: Array<{
    commertialOffer?: {
      PriceValidUntil?: string
      priceState?: unknown
    }
  }>
}

const isPriceStateObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const earliestValidUntil = (items: CapItem[]) => {
  let earliest: number | undefined

  for (const item of items) {
    for (const seller of item?.sellers ?? []) {
      const offer = seller?.commertialOffer

      if (!offer || !isPriceStateObject(offer.priceState)) {
        continue
      }

      if (typeof offer.PriceValidUntil !== 'string') {
        continue
      }

      const parsed = Date.parse(offer.PriceValidUntil)

      if (!Number.isFinite(parsed)) {
        continue
      }

      if (earliest === undefined || parsed < earliest) {
        earliest = parsed
      }
    }
  }

  return earliest
}

/**
 * Lowers sMaxAge and staleWhileRevalidate already stored on ctx.cacheControl
 * when a raw Intelligent Search offer carries a priceState object and a
 * parseable PriceValidUntil. Does not create a hint and does not change scope.
 */
export const applySearchCacheCap = (
  ctx: { cacheControl?: CacheControl },
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

  if (typeof cacheControl.sMaxAge === 'number') {
    cacheControl.sMaxAge = Math.min(
      cacheControl.sMaxAge,
      Math.min(300, seconds)
    )
  }

  if (typeof cacheControl.staleWhileRevalidate === 'number') {
    cacheControl.staleWhileRevalidate = Math.min(
      cacheControl.staleWhileRevalidate,
      Math.min(3600, seconds)
    )
  }
}
