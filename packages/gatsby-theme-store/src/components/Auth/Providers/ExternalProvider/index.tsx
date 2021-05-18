import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { api } from '@vtex/gatsby-theme-store/src/sdk/auth/Service/api'
import { useStartLogin } from '@vtex/gatsby-theme-store/src/sdk/auth/useStartLogin'
import type { AuthProviderComponentProps } from '@vtex/store-ui'
import { Alert, Box, Center, Spinner, UIButton } from '@vtex/store-ui'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

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
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
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
        {formatMessage({
          id: `login.page.externalOAuth.title`,
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
          <UIButton onClick={() => setState('initial')}>
            {formatMessage({
              id: 'login.page.externalOAuth.tryAgain',
            })}
          </UIButton>
        </>
      )}
    </Box>
  )
}

export default ExternalProvider
