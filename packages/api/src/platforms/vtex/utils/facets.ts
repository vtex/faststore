import ChannelMarshal from './channel'
import type { Maybe } from '../../../__generated__/schema'

export interface SelectedFacet {
  key: string
  value: string
}

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

    default:
      return { key, value }
  }
}

export const findLocale = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((x) => x.key === 'locale')?.value ?? null

export const findChannel = (facets?: Maybe<SelectedFacet[]>) =>
  facets?.find((facet) => facet.key === 'channel')?.value ?? null
