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

  return offer
}
