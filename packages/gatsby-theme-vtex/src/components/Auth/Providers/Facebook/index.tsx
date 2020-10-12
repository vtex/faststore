import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Alert, Box, Button, Center, Spinner } from '@vtex/store-ui'
import React, { FC, useEffect, useState } from 'react'

import { OAuthLogin } from '../../../../sdk/auth/OAuth'
import { oAuthCallbackUrl } from '../../../../sdk/auth/OAuth/paths'
import { startLogin } from '../../../../sdk/auth/Service'
import { onLoginSuccessful } from '../../../../sdk/auth/utils'
import { AuthProviderComponentProps } from '../types'

type State = 'initial' | 'error'

const FacebookOAuth: FC<AuthProviderComponentProps> = ({ variant: v }) => {
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
          await OAuthLogin({ providerName: 'Facebook' })

          onLoginSuccessful()
        }
      } catch {
        setState('error')
      }
    })()
  }, [state])

  return (
    <Box variant={variant}>
      <Box variant={`${variant}.title`}>
        {formatMessage({
          id: 'login.page.facebookOAuth.title',
          defaultMessage: 'Signing in with facebook',
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
              defaultMessage:
                'Signing in with Facebook failed. Please try again later or click on the button below to try again',
            })}
          </Alert>
          <Button onClick={() => setState('initial')}>
            {formatMessage({
              id: 'login.page.facebookOAuth.tryAgain',
              defaultMessage: 'Try Again',
            })}
          </Button>
        </>
      )}
    </Box>
  )
}

export default FacebookOAuth
