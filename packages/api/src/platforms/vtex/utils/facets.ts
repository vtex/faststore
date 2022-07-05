import ChannelMarshal from './channel'
import type { Maybe } from '../../../__generated__/schema'

export interface SelectedFacet {
  key: string
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
    case 'channel': {
      const channel = ChannelMarshal.parse(value)
      const channelFacets = [
        { key: 'trade-policy', value: channel.salesChannel },
      ]

      if (channel.regionId) {
        channelFacets.push({ key: 'region-id', value: channel.regionId })
      }

      return channelFacets
    }

    case 'locale': {
      return [] // remove this facet from search
    }

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
): x is keyof typeof FACET_CROSS_SELLING_MAP =>
  typeof (FACET_CROSS_SELLING_MAP as Record<string, string>)[x] === "string"

export const findCrossSelling = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((
    x,
  ): x is { key: keyof typeof FACET_CROSS_SELLING_MAP; value: string } =>
    isCrossSelling(x.key)
  ) ?? null

export const findSlug = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((x) => x.key === 'slug')?.value ?? null

export const findSkuId = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((x) => x.key === 'id')?.value ?? null

export const findLocale = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((x) => x.key === 'locale')?.value ?? null

export const findChannel = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((facet) => facet.key === 'channel')?.value ?? null
