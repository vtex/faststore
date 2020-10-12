import { Button } from '@vtex/store-ui'
import React, { FC } from 'react'

import { AuthProviderButtonProps } from '../types'

const EmailVerificationButton: FC<AuthProviderButtonProps> = ({
  variant: v,
  ...rest
}) => (
  <Button variant={`${v}.emailVerification`} as="button" {...rest}>
    receive access code by e-mail
  </Button>
)

export default EmailVerificationButton
