import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button } from 'theme-ui'
import React from 'react'
import type { FC } from 'react'

import type { AuthProviderButtonProps } from '../types'

const EmailVerificationButton: FC<AuthProviderButtonProps> = ({
  variant,
  ...rest
}) => {
  const { formatMessage } = useIntl()

  return (
    <Button variant={`${variant}.emailVerification`} as="button" {...rest}>
      {formatMessage({
        id: 'login.page.emailVerification.button',
      })}
    </Button>
  )
}

export default EmailVerificationButton
