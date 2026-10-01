import type { ServerProductQueryQuery } from '@generated/graphql'

type ServerOffers = ServerProductQueryQuery['product']['offers']
type ServerOffer = ServerOffers['offers'][number]

/**
 * Schema.org properties the PDP JSON-LD is allowed to publish on an Offer.
 *
 * This is an allowlist on purpose. The PDP's server query and
 * `ProductDetailsFragment_product` both select `offers.offers`, and GraphQL
 * merges the two selection sets — so the offer object reaching this module
 * carries UI-only fields (`priceWithTaxes`, `listPrice`, `listPriceWithTaxes`,
 * `quantity`, `priceToken`) that have no meaning to Schema.org consumers.
 * Excluding them by name would mean tracking a fragment this module does not
 * own, which is exactly how they leaked into public markup in the first place.
 */
const SCHEMA_ORG_OFFER_FIELDS = [
  'availability',
  'itemCondition',
  'price',
  'priceValidUntil',
] as const satisfies ReadonlyArray<keyof ServerOffer>

// Emptiness, not falsiness: `price` is numeric and `0` is a real price, so a
// falsy check would strip it and leave an Offer with no price at all.
const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === ''

type ObjectLevelFields = {
  priceCurrency: ServerOffers['priceCurrency']
  url: string
}

/**
 * Builds the `offers` object for the PDP's `ProductJsonLd`, or `undefined` when
 * the product has no offer to describe.
 *
 * `undefined` matters: an `Offer` carrying only a currency and a URL is invalid
 * Schema.org, so omitting the property entirely beats emitting a priceless one.
 * Every key is dropped when its value is empty — `priceValidUntil` and
 * `availability` are both nullable upstream.
 */
export const toProductJsonLdOffer = (
  serverOffer: ServerOffer | undefined,
  { priceCurrency, url }: ObjectLevelFields
) => {
  if (!serverOffer) {
    return undefined
  }

  const offer: Record<string, unknown> = { priceCurrency, url }

  for (const field of SCHEMA_ORG_OFFER_FIELDS) {
    offer[field] = serverOffer[field]
  }

  for (const [key, value] of Object.entries(offer)) {
    if (isEmpty(value)) {
      delete offer[key]
    }
  }

  // `price` resolves to null outside the search and order-form roots. Dropping
  // the key alone would leave a priceless Offer — the same invalid markup the
  // no-offer case above avoids, so it gets the same treatment.
  if (isEmpty(offer.price)) {
    return undefined
  }

  return offer
}

// Epoch values are disambiguated by magnitude, not digit count: anything at or
// above this is milliseconds (>= 1973-03-03), anything below is seconds. A
// millisecond value under the threshold is read as seconds — accepted, since no
// real catalog carries a release date that early, and a digit-count heuristic
// leaves a strictly larger hole (9-digit seconds and 12-digit milliseconds both
// fall through to the string parser, which reads them as a year).
const MILLISECONDS_THRESHOLD = 1e11

const isAllDigits = (value: string) => /^\d+$/.test(value)

// An ISO date-time with no timezone designator. `new Date()` reads these as
// host-local time (date-only forms are already read as UTC), which would make
// the emitted calendar day depend on the build machine's zone.
const ISO_DATE_TIME_WITHOUT_ZONE =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/

const toDate = (value: string): Date => {
  if (!isAllDigits(value)) {
    return new Date(
      ISO_DATE_TIME_WITHOUT_ZONE.test(value) ? `${value}Z` : value
    )
  }

  const epoch = Number(value)

  return new Date(epoch >= MILLISECONDS_THRESHOLD ? epoch : epoch * 1000)
}

/**
 * Normalizes `StoreProduct.releaseDate` to the ISO 8601 calendar date
 * (`YYYY-MM-DD`) Schema.org expects for the PDP's `ProductJsonLd`.
 *
 * The API passes the field through as Intelligent Search delivers it — epoch
 * milliseconds for most accounts, an ISO string for others — because stores
 * read that raw value in their own customizations. Normalizing here, and only
 * here, keeps the structured data valid without changing that contract.
 *
 * Accepts epoch milliseconds, epoch seconds, and date strings. Returns an empty
 * string when the input is absent or unparseable — never throws, and never
 * returns `"Invalid Date"`.
 *
 * The calendar day is always taken in UTC, so a build produces the same markup
 * on any machine. An input carrying a timezone offset is converted first, which
 * means `2026-03-23T21:00:00-05:00` normalizes to `2026-03-24`. That is
 * deliberate: preserving the source calendar day would make the output depend on
 * the offset embedded in each record. An input with no timezone designator is
 * read as UTC rather than as host-local time, for the same reason.
 */
export const toProductJsonLdReleaseDate = (
  value: string | number | null | undefined
): string => {
  if (value === null || value === undefined) {
    return ''
  }

  const raw = String(value).trim()

  if (raw === '') {
    return ''
  }

  const date = toDate(raw)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}
