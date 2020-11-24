import { api } from './Service/api'

type OAuthProvider = 'Google' | 'Facebook'

interface Options {
  providerName: OAuthProvider
}

export const oAuthErrorFallbackUrl = new URL(
  api.oauth.error,
  window.location.origin
).href

export const oAuthCallbackUrl = new URL(
  api.oauth.finish,
  window.location.origin
).href

export const oAuthRedirectUrl = ({ providerName }: Options) => {
  const errorFallbackUrl = oAuthErrorFallbackUrl
  const search = new URLSearchParams()

  search.append('providerName', providerName)
  search.append('errorFallbackUrl', errorFallbackUrl)

  return `${api.pub.authentication.oauth.redirect}?${search.toString()}`
}
