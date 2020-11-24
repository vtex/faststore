import React, { FC, useRef } from 'react'
import { Alert, Box, Button, Input } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { State } from './state'

interface Props {
  variant: string
  onSubmit: (email: string, password: string) => Promise<void>
  onSignUp: () => void
  onForgotPassword: () => void
  state: State
}

const SignInForm: FC<Props> = ({
  variant,
  onSubmit,
  onSignUp,
  onForgotPassword,
  state: { state },
}) => {
  const { formatMessage } = useIntl()
  const email = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)

  return (
    <>
      <Box variant={`${variant}.title`}>
        {formatMessage({
          id: 'login.page.emailAndPassword.signInForm.title',
          defaultMessage: 'Sign in with e-mail and password',
        })}
      </Box>
      <Box
        as="form"
        onSubmit={(e) => {
          e.preventDefault()

          onSubmit(email.current?.value ?? '', password.current?.value ?? '')
        }}
        variant={variant}
      >
        <Input
          ref={email}
          type="email"
          name="email"
          id="email"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signInForm.emailPlaceholder',
            defaultMessage: 'Eg: example@gmail.com',
          })}
          autoComplete="username"
        />
        <Input
          ref={password}
          type="password"
          name="password"
          id="password"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signInForm.password',
            defaultMessage: 'Insert your password',
          })}
          autoComplete="current-password"
        />
        <Box
          variant={`${variant}.forgotPassword`}
          onClick={() => onForgotPassword()}
        >
          {formatMessage({
            id: 'login.page.emailAndPassword.signInForm.forgotPassword',
            defaultMessage: 'Forgot my password',
          })}
        </Box>

        {state === 'signInForm.invalidEmailInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signInForm.invalidEmailInput',
              defaultMessage: 'Sign in with a valid e-mail',
            })}
          </Alert>
        )}

        {state === 'signInForm.invalidPasswordInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signInForm.invalidPasswordInput',
              defaultMessage: 'Sign in with a valid password',
            })}
          </Alert>
        )}

        {state === 'signInForm.authError' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signInForm.authError',
              defaultMessage: 'Signing in failed. Please try again later',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailAndPassword.signInForm.submitButton',
            defaultMessage: 'Sign In',
          })}
        </Button>
      </Box>
      <Box variant={`${variant}.signup`} onClick={() => onSignUp()}>
        {formatMessage({
          id: 'login.page.emailAndPassword.signInForm.signupButton',
          defaultMessage: "Don't have an account yet ? Sign Up",
        })}
      </Box>
    </>
  )
}

export default SignInForm
