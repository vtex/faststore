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

      // This array should have all values from channel string
      return [{ key: 'trade-policy', value: channel.salesChannel }]
    }

    default:
      return { key, value }
  }
}
