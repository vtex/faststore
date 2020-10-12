import { Button } from '@vtex/store-ui'
import React, { FC } from 'react'

import { AuthProviderButtonProps } from '../types'

const FacebookOAuthButton: FC<AuthProviderButtonProps> = ({
  variant: v,
  ...rest
}) => (
  <Button variant={`${v}.facebook`} as="button" {...rest}>
    sign in with facebook
  </Button>
)

export default FacebookOAuthButton
