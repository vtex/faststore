import { Alert, Box, Button, Center, Flex, Spinner } from '@vtex/store-ui'
import type { AuthProviderComponentProps } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useStartLogin } from '@vtex/gatsby-theme-store/src/sdk/auth/useStartLogin'
import { api } from '@vtex/gatsby-theme-store/src/sdk/auth/Service/api'

const oAuthErrorFallbackUrl = () =>
  new URL(api.oauth.error, window.location.origin).href

const oAuthCallbackUrl = () =>
  new URL(api.oauth.finish, window.location.origin).href

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
  const variant = `customOAuth.${providerName}.${v}`

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
    <Flex variant={variant}>
      <Box variant={variant}>
        {state === 'initial' ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Alert variant="signInDanger">
              {formatMessage({
                id: 'login.page.customOAuth.error',
              })}
            </Alert>
            <Button onClick={() => setState('initial')}>
              {formatMessage({
                id: 'login.page.googleOAuth.tryAgain',
              })}
            </Button>
          </>
        )}
      </Box>
    </Flex>
  )
}

export default ExternalProvider
