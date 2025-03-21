import { parse } from 'cookie'
import type { Context, Options } from '../..'
import { getStoreCookie, getWithCookie } from '../../utils/cookies'
import { fetchAPI } from '../fetch'
import type { ProfileAddress } from '../profile/types/ProfileAddress'

export const Profile = ({ account, environment }: Options, ctx: Context) => {
  const base = `https://${account}.${environment}.com.br/api/profile-system/pvt/profiles`

  const storeCookies = getStoreCookie(ctx)
  const withCookie = getWithCookie(ctx)

  const cookies = parse(ctx?.headers?.cookie ?? '')
  const VtexIdclientAutCookie = cookies['VtexIdclientAutCookie_' + account]

  return {
    // profile
    // addresses
    // orders
    addresses: async (userId: string): Promise<ProfileAddress[]> => {
      const headers: HeadersInit = withCookie({ VtexIdclientAutCookie })
      return fetchAPI(
        `${base}/${userId}/addresses`,
        { headers },
        { storeCookies }
      )
    },
  }
}
