export interface Channel {
  seller?: string
  regionId?: string
  salesChannel?: string
  hasOnlyDefaultSalesChannel?: boolean
}

export default class ChannelMarshal {
  public static parse(channelString: string): Required<Channel> {
    try {
      const parsedChannel = JSON.parse(channelString) as Channel

      return {
        seller: parsedChannel.seller ?? '',
        regionId: parsedChannel.regionId ?? '',
        salesChannel: parsedChannel.salesChannel ?? '',
        hasOnlyDefaultSalesChannel: parsedChannel.hasOnlyDefaultSalesChannel ?? true
      }
    } catch (error) {
      console.error(error)

      throw new Error('Malformed channel string')
    }
  }

  public static stringify(channel: Channel): string {
    return JSON.stringify(channel)
  }
}
