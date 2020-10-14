import { OAuthProvider } from './types'
import { oAuthErrorFallbackUrl, oAuthRedirectUrl } from './paths'

interface Options {
  providerName: OAuthProvider
}

export const OAuthLogin = ({ providerName }: Options) =>
  new Promise((resolve, reject) => {
    const popup = window.open(
      '',
      providerName.toUpperCase(),
      'toolbar=no, location=no, directories=no, status=no, copyhistory=no, menubar=no,width=800,height=600,scrollbars=yes'
    )

    if (!popup) {
      return
    }

    popup.focus()
    const errorFallbackUrl = oAuthErrorFallbackUrl()
    const url = oAuthRedirectUrl({ providerName, errorFallbackUrl })

    popup.location.assign(url)

    const id = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(id)

        reject(new Error('Something went wrong with OAuth'))
      }

      if (popup.location.href.indexOf(window.location.host) === -1) {
        return
      }

      const qs = new URLSearchParams(popup.location.search)
      const authStatus = qs.get('authStatus')

      clearInterval(id)
      popup.close()

      if (authStatus === 'Success') {
        resolve()
      } else {
        reject(new Error('Something went wrong with OAuth'))
      }
    }, 500)
  })
