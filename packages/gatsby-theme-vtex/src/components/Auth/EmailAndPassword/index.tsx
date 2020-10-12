import { Box, Button, Input } from '@vtex/store-ui'
import React, { FC } from 'react'

import { AuthProviderComponentProps } from '../types'

const EmailAndPassword: FC<AuthProviderComponentProps> = ({ variant: v }) => {
  const variant = `emailAndPassword.${v}`

  return (
    <>
      <Box variant={`${variant}.title`}>Sign in with e-mail and password</Box>
      <Box as="form" onSubmit={(e) => e.preventDefault()} variant={variant}>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Eg: example@gmail.com"
          autoComplete="username"
        />
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Add your password"
          autoComplete="current-password"
        />
        <Box variant={`${variant}.forgotPassword`}>Forgot my password</Box>
        <Button>Sign In</Button>
      </Box>
      <Box variant={`${variant}.signup`}>
        Don&apos;t have an account yet ? Sign Up
      </Box>
    </>
  )
}

export default EmailAndPassword
