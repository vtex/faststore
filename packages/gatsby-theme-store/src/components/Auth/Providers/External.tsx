import { OAuthProvider } from '@vtex/store-ui'
import React from 'react'
import type { AuthProviderComponentProps } from '@vtex/store-ui'
import type { FC } from 'react'

import {
  oAuthCallbackUrl,
  oAuthErrorFallbackUrl,
} from '../../../sdk/auth/OAuth'
import { api } from '../../../sdk/auth/Service/api'
import { useStartLogin } from '../../../sdk/auth/useStartLogin'

const oAuthRedirectUrl = (providerName: string) => {
  const search = new URLSearchParams()

  search.append('providerName', providerName)
  search.append('errorFallbackUrl', oAuthErrorFallbackUrl())

  return `${api.pub.authentication.oauth.redirect}?${search.toString()}`
}

const External: FC<AuthProviderComponentProps> = ({
  providerName = '',
  ...rest
}) => {
  const startLogin = useStartLogin()

  const myStartLogin = async () => {
    await startLogin({
      callbackUrl: oAuthCallbackUrl(),
    })

    window.location.href = oAuthRedirectUrl(providerName)
  }

  return (
    <OAuthProvider
      {...rest}
      startLogin={myStartLogin}
      providerName={providerName}
    />
  )
}

export default External
