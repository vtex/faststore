import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button } from '@vtex/store-ui'
import type { FC } from 'react'
import React from 'react'

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
