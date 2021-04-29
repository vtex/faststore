import React, { useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Alert, Box, Button, Input } from 'theme-ui'
import type { FC } from 'react'

import type { State } from './state'

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
        <FormattedMessage id="login.page.emailAndPassword.signInForm.title" />
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
          id="signin-email"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signInForm.emailPlaceholder',
          })}
          autoComplete="username"
        />
        <Input
          ref={password}
          type="password"
          name="password"
          id="signin-password"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signInForm.password',
          })}
          autoComplete="current-password"
        />
        <Box
          variant={`${variant}.forgotPassword`}
          onClick={() => onForgotPassword()}
        >
          <FormattedMessage id="login.page.emailAndPassword.signInForm.forgotPassword" />
        </Box>

        {state === 'signInForm.invalidEmailInput' && (
          <Alert variant="signInDanger">
            <FormattedMessage id="login.page.emailAndPassword.signInForm.invalidEmailInput" />
          </Alert>
        )}

        {state === 'signInForm.invalidPasswordInput' && (
          <Alert variant="signInDanger">
            <FormattedMessage id="login.page.emailAndPassword.signInForm.invalidPasswordInput" />
          </Alert>
        )}

        {state === 'signInForm.authError' && (
          <Alert variant="signInDanger">
            <FormattedMessage id="login.page.emailAndPassword.signInForm.authError" />
          </Alert>
        )}

        <Button>
          <FormattedMessage id="login.page.emailAndPassword.signInForm.submitButton" />
        </Button>
      </Box>
      <Box variant={`${variant}.signup`} onClick={() => onSignUp()}>
        <FormattedMessage id="login.page.emailAndPassword.signInForm.signupButton" />
      </Box>
    </>
  )
}

export default SignInForm
