export interface Channel {
  regionId?: string
  salesChannel?: string
}

export default class ChannelMarshal {
  public static parse(channelString: string): Required<Channel> {
    try {
      const parsedChannel = JSON.parse(channelString) as Channel

      return {
        regionId: parsedChannel.regionId ?? '',
        salesChannel: parsedChannel.salesChannel ?? '',
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
