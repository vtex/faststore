import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Alert, Box, Button, Input, Label } from '@vtex/store-ui'
import React, { useRef } from 'react'
import type { FC } from 'react'

import type { State } from './state'

interface Props {
  variant: string
  onSubmit: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>
  onBack: () => void
  state: State
}

const SignUpForm: FC<Props> = ({
  variant,
  onSubmit,
  onBack,
  state: { state, email },
}) => {
  const { formatMessage } = useIntl()
  const code = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const confirmPwd = useRef<HTMLInputElement>(null)

  return (
    <>
      <Box variant={`${variant}.title`}>
        {formatMessage({
          id: 'login.page.emailAndPassword.signUpForm.title',
        })}
      </Box>
      <Box variant={`${variant}.subTitle`}>
        {formatMessage(
          {
            id: 'login.page.emailAndPassword.signUpForm.subTitle',
          },
          {
            email,
          }
        )}
      </Box>
      <Box
        as="form"
        onSubmit={(e) => {
          e.preventDefault()

          onSubmit(
            code.current?.value ?? '',
            password.current?.value ?? '',
            confirmPwd.current?.value ?? ''
          )
        }}
        variant={variant}
      >
        <Label htmlFor="signup-code">
          {formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.accessCodeLabel',
          })}
        </Label>
        <Input
          ref={code}
          type="text"
          name="code"
          id="signup-code"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.accessCodePlaceholder',
          })}
        />
        <Label htmlFor="signup-password">
          {formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.passwordLabel',
          })}
        </Label>
        <Input
          ref={password}
          type="password"
          name="password"
          id="signup-password"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.passwordPlaceholder',
          })}
          autoComplete="new-password"
        />
        <Label htmlFor="signup-confirm-password">
          {formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.confirmPasswordLabel',
          })}
        </Label>
        <Input
          ref={confirmPwd}
          type="password"
          name="password"
          id="signup-confirm-password"
          placeholder={formatMessage({
            id:
              'login.page.emailAndPassword.signUpForm.confirmPasswordPlaceholder',
          })}
          autoComplete="new-password"
        />

        {state === 'signUpForm.invalidAccessCodeInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id:
                'login.page.emailAndPassword.signUpForm.invalidAccessCodeInput',
            })}
          </Alert>
        )}

        {state === 'signUpForm.invalidPassword' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signUpForm.invalidPassword',
            })}
          </Alert>
        )}

        {state === 'signUpForm.passwordDoNotMatch' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signUpForm.passwordDoNotMatch',
            })}
          </Alert>
        )}

        {state === 'signUpForm.error' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signUpForm.error',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.submitButton',
          })}
        </Button>
      </Box>
      <Button
        onClick={(e) => {
          e.preventDefault()
          onBack()
        }}
      >
        {formatMessage({
          id: 'login.page.emailAndPassword.signUpForm.backButton',
        })}
      </Button>
    </>
  )
}

export default SignUpForm
