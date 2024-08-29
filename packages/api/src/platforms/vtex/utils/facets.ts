import type { Maybe } from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export interface SelectedFacet {
  key: string
  value: string
}

export interface CrossSellingFacet {
  key: keyof typeof FACET_CROSS_SELLING_MAP
  value: string
}

export const FACET_CROSS_SELLING_MAP = {
  buy: "whoboughtalsobought",
  view: "whosawalsosaw",
  similars: "similars",
  viewAndBought: "whosawalsobought",
  accessories: "accessories",
  suggestions: "suggestions",
} as const

/**
 * Transform facets from the store to VTEX platform facets.
 * For instance, the channel in Store becomes trade-policy and regionId in VTEX's realm
 * */
export const transformSelectedFacet = ({ key, value }: SelectedFacet) => {
  switch (key) {
    case 'price': {
      return { key, value: value.replace('-to-', ':') }
    }
    
    case 'channel': 
    case 'locale': 
    case "buy":
    case "view":
    case "similars":
    case "viewAndBought":
    case "accessories":
    case "suggestions": {
      return [] // remove this facet from search
    }

    default:
      return { key, value }
  }
}

export const parseRange = (range: string): [number, number] | null => {
  const splitted = range.split(':').map(Number)

  if (
    splitted.length !== 2 ||
    Number.isNaN(splitted[0]) ||
    Number.isNaN(splitted[1])
  ) {
    return null
  }

  return splitted as [number, number]
}

export const isCrossSelling = (
  x: string,
): x is CrossSellingFacet['key'] =>
  typeof (FACET_CROSS_SELLING_MAP as Record<string, string>)[x] === "string"

export const findCrossSelling = (facets?: Maybe<SelectedFacet[]>) => {
  const filtered = facets?.filter((x): x is CrossSellingFacet => isCrossSelling(x.key))

  if (Array.isArray(filtered) && filtered.length > 1) {
    throw new BadRequestError(
      `You passed ${filtered.length} cross selling facets but only one is allowed. Please leave one of the following facet: ${filtered.map(x => x.key).join(',')}`
    )
  }

  return filtered?.[0] ?? null
}

export const findSlug = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((x) => x.key === 'slug')?.value ?? null

export const findSkuId = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((x) => x.key === 'id')?.value ?? null

export const findLocale = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((x) => x.key === 'locale')?.value ?? null

export const findChannel = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((facet) => facet.key === 'channel')?.value ?? null
