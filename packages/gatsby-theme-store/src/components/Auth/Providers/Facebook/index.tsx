import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Alert, Box, Button, Center, Spinner } from '@vtex/store-ui'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'

import { oAuthCallbackUrl, oAuthRedirectUrl } from '../../../../sdk/auth/OAuth'
import { useStartLogin } from '../../../../sdk/auth/useStartLogin'
import type { AuthProviderComponentProps } from '../types'

type State = 'initial' | 'error'

const FacebookOAuth: FC<AuthProviderComponentProps> = ({ variant: v }) => {
  const startLogin = useStartLogin()
  const { formatMessage } = useIntl()
  const [state, setState] = useState<State>('initial')
  const variant = `facebookOAuth.${v}`

  useEffect(() => {
    ;(async () => {
      try {
        if (state === 'initial') {
          await startLogin({
            callbackUrl: oAuthCallbackUrl,
          })

          window.location.href = oAuthRedirectUrl({ providerName: 'Facebook' })
        }
      } catch {
        setState('error')
      }
    })()
  }, [startLogin, state])

  return (
    <Box variant={variant}>
      <Box variant={`${variant}.title`}>
        {formatMessage({
          id: 'login.page.facebookOAuth.title',
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
              id: 'login.page.facebookOAuth.error',
            })}
          </Alert>
          <Button onClick={() => setState('initial')}>
            {formatMessage({
              id: 'login.page.facebookOAuth.tryAgain',
            })}
          </Button>
        </>
      )}
    </Box>
  )
}

export default FacebookOAuth
