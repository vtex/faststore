import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button } from '@vtex/store-ui'
import React, { FC } from 'react'

import { AuthProviderButtonProps } from '../types'

const EmailVerificationButton: FC<AuthProviderButtonProps> = ({
  variant: v,
  ...rest
}) => {
  const { formatMessage } = useIntl()

  return (
    <Button variant={`${v}.emailVerification`} as="button" {...rest}>
      {formatMessage({
        id: 'login.page.emailVerification.button',
        defaultMessage: 'Receive access code by e-mail',
      })}
    </Button>
  )
}

export default EmailVerificationButton
