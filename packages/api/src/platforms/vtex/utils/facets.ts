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

      const result = []

      if (channel.salesChannel) {
        result.push({ key: 'trade-policy', value: channel.salesChannel })
      }

      // TODO: Remove comment when the IS accept regionId facet.
      // if (channel.regionId) {
      // result.push({ key: 'regionId', value: channel.regionId })
      // }

      return result
    }

    default:
      return { key, value }
  }
}
