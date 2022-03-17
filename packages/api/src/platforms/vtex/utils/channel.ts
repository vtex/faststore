export interface Channel {
  postalCode: string
  regionId: string
  country: string
  salesChannel: string
}

export default class ChannelParser {
  private _channel: string
  private channel: Channel
  constructor(channel: string) {
    this._channel = channel
    this.channel = this._parse()
  }

  private _parse(): Channel {
    try {
      const parsedChannel = JSON.parse(this._channel)

      this.channel = {
        ...this.channel,
        regionId: parsedChannel.regionId ?? '',
        country: parsedChannel.country ?? '',
        salesChannel: parsedChannel.salesChannel ?? '',
        postalCode: parsedChannel.postalCode ?? '',
      }

      return this.channel
    } catch (error) {
      console.error(error)

      throw new Error('Malformed channel string')
    }
  }

  public parse(): Channel {
    return this.channel
  }

  public stringify(): string {
    return this._channel
  }

  public updateChannel(partialChannel: Partial<Channel>) {
    this.channel = { ...this.channel, ...partialChannel }

    this._channel = JSON.stringify(this.channel)
  }
}
