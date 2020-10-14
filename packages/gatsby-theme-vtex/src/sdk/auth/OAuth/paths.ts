import { OAuthProvider } from './types'
import { api } from '../Service/api'

interface Options {
  providerName: OAuthProvider
  errorFallbackUrl: string
}

export const oAuthRedirectUrl = ({
  providerName,
  errorFallbackUrl,
}: Options) => {
  const search = new URLSearchParams()

  search.append('providerName', providerName)
  search.append('errorFallbackUrl', errorFallbackUrl)

  return `${api.pub.authentication.oauth.redirect}?${search.toString()}`
}

export const oAuthErrorFallbackUrl = () =>
  new URL(api.oauth.error, window.location.origin).href
