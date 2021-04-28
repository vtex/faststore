import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
import React, { useEffect, useState } from 'react'
import { Alert, Box, Button } from 'theme-ui'
import type { FC } from 'react'

import type { AuthProviderComponentProps } from '../types'
import Center from '../../../Center'
import Spinner from '../../../Spinner'

interface Props extends AuthProviderComponentProps {
  startLogin: () => Promise<void>
}

const OAuth: FC<Props> = ({ providerName, variant: v, startLogin }) => {
  // const startLogin = useStartLogin()
  const [state, setState] = useState('initial')
  const variant = `externalOAuth.${providerName}.${v}`

  useEffect(() => {
    startLogin().catch(() => setState('error'))
  }, [startLogin])

  return (
    <Box variant={variant}>
      <Box variant={`${variant}.title`}>
        <FormattedMessage id="login.page.externalOAuth.title" />
      </Box>
      {state === 'initial' ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          <Alert variant="signInDanger">
            <FormattedMessage id="login.page.externalOAuth.error" />
          </Alert>
          <Button onClick={() => setState('initial')}>
            <FormattedMessage id="login.page.externalOAuth.tryAgain" />
          </Button>
        </>
      )}
    </Box>
  )
}

export default OAuth
