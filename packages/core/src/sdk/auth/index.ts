import { useSession } from '../session'

export const useAuth = () => {
  const {
    person,
    isValidating,
    channel: channelJson,
  } = useSession({ filter: false })

  const channel = JSON.parse(channelJson) as {
    salesChannel: number
    regionId: string
    hasOnlyDefaultSalesChannel?: boolean
  }

  const hasSalesChannel =
    Boolean(channel.salesChannel) &&
    channel.hasOnlyDefaultSalesChannel === false

  const isAutenticated = hasSalesChannel && person

  return { isAutenticated, profile: person, channel, isValidating }
}
