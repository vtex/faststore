import { Button } from '@vtex/store-ui'
import React, { FC } from 'react'

import { AuthProviderButtonProps } from '../types'

const EmailAndPasswordButton: FC<AuthProviderButtonProps> = ({
  variant: v,
  ...rest
}) => (
  <Button variant={`${v}.emailAndPassword`} as="button" {...rest}>
    sign in with email and password
  </Button>
)

export default EmailAndPasswordButton
