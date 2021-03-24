import { Alert, Box, Button, Center, Spinner } from '@vtex/store-ui'
import type { AuthProviderComponentProps } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useStartLogin } from '@vtex/gatsby-theme-store/src/sdk/auth/useStartLogin'
import { api } from '@vtex/gatsby-theme-store/src/sdk/auth/Service/api'

import {
  oAuthCallbackUrl,
  oAuthErrorFallbackUrl,
} from '../../../../sdk/auth/OAuth'

const oAuthRedirectUrl = (providerName: string) => {
  const search = new URLSearchParams()

  search.append('providerName', providerName)
  search.append('errorFallbackUrl', oAuthErrorFallbackUrl())

  return `${api.pub.authentication.oauth.redirect}?${search.toString()}`
}

const ExternalProvider: FC<AuthProviderComponentProps> = ({
  variant: v,
  providerName = '',
}) => {
  const { formatMessage } = useIntl()
  const startLogin = useStartLogin()
  const [state, setState] = useState<string>('initial')
  const variant = `externalOAuth.${providerName}.${v}`

  useEffect(() => {
    ;(async () => {
      if (!window) {
        return
      }

      try {
        await startLogin({
          callbackUrl: oAuthCallbackUrl(),
        })

        window.location.href = oAuthRedirectUrl(providerName)
      } catch {
        setState('error')
      }
    })()
  }, [providerName, startLogin, state])

  return (
    <Box variant={variant}>
      <Box variant={`${variant}.title`}>
        {(providerName === 'Google' || providerName === 'Facebook') &&
          formatMessage({
            id: `login.page.${providerName.toLowerCase()}OAuth.title`,
          })}
      </Box>
      {state === 'initial' ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.externalOAuth.error',
            })}
          </Alert>
          <Button onClick={() => setState('initial')}>
            {formatMessage({
              id: 'login.page.externalOAuth.tryAgain',
            })}
          </Button>
        </>
      )}
    </Box>
  )
}

export default ExternalProvider
