import ChannelMarshal from './channel'

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

    default:
      return { key, value }
  }
}
