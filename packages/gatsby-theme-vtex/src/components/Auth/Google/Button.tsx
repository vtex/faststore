import { Button } from '@vtex/store-ui'
import React, { FC } from 'react'

import { AuthProviderButtonProps } from '../types'

const GoogleOAuthButton: FC<AuthProviderButtonProps> = ({
  variant: v,
  ...rest
}) => (
  <Button variant={`${v}.google`} as="button" {...rest}>
    sign in with google
  </Button>
)

export default GoogleOAuthButton
