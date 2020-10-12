import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button } from '@vtex/store-ui'
import React, { FC } from 'react'

import { AuthProviderButtonProps } from '../types'

const EmailAndPasswordButton: FC<AuthProviderButtonProps> = ({
  variant: v,
  ...rest
}) => {
  const { formatMessage } = useIntl()

  return (
    <Button variant={`${v}.emailAndPassword`} as="button" {...rest}>
      {formatMessage({
        id: 'login.page.emailAndPassword.button',
        defaultMessage: 'Sign in with email and password',
      })}
    </Button>
  )
}

export default EmailAndPasswordButton
