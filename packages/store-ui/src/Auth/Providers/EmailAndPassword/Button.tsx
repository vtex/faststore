import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'theme-ui'
import type { FC } from 'react'

import type { AuthProviderButtonProps } from '../types'

const EmailAndPasswordButton: FC<AuthProviderButtonProps> = ({
  variant,
  ...rest
}) => (
  <Button variant={`${variant}.emailAndPassword`} as="button" {...rest}>
    <FormattedMessage id="login.page.emailAndPassword.button" />
  </Button>
)

export default EmailAndPasswordButton
