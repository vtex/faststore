import { useIntl } from 'react-intl'
import React from 'react'
import type { FC } from 'react'
import { Button } from 'theme-ui'

import type { AuthProviderButtonProps } from '../types'

const EmailAndPasswordButton: FC<AuthProviderButtonProps> = ({
  variant,
  ...rest
}) => {
  const { formatMessage } = useIntl()

  return (
    <Button variant={`${variant}.emailAndPassword`} as="button" {...rest}>
      {formatMessage({
        id: 'login.page.emailAndPassword.button',
      })}
    </Button>
  )
}

export default EmailAndPasswordButton
