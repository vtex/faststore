import React, { FC, useRef } from 'react'
import { Alert, Box, Button, Input } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { State } from './state'

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
          defaultMessage: 'Validate email and create new password',
        })}
      </Box>
      <Box variant={`${variant}.subTitle`}>
        {formatMessage(
          {
            id: 'login.page.emailAndPassword.signUpForm.subTitle',
            defaultMessage:
              'Insert the code we sent to the email {email} and create a new password',
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
        <Input
          ref={code}
          type="text"
          name="code"
          id="code"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.accessCodePlaceholder',
            defaultMessage: 'Add your access code',
          })}
        />
        <Input
          ref={password}
          type="password"
          name="password"
          id="password"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.passwordPlaceholder',
            defaultMessage: 'Insert your password',
          })}
          autoComplete="new-password"
        />
        <Input
          ref={confirmPwd}
          type="password"
          name="password"
          id="confirm-password"
          placeholder={formatMessage({
            id:
              'login.page.emailAndPassword.signUpForm.confirmPasswordPlaceholder',
            defaultMessage: 'Confirm your password',
          })}
          autoComplete="new-password"
        />

        {state === 'signUpForm.invalidAccessCodeInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id:
                'login.page.emailAndPassword.signUpForm.invalidAccessCodeInput',
              defaultMessage: 'Invalid access code',
            })}
          </Alert>
        )}

        {state === 'signUpForm.invalidPassword' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signUpForm.invalidPassword',
              defaultMessage:
                'Invalid password. Your password needs to have at least eight digits, one lower case and one upper case letter, with at least one digit',
            })}
          </Alert>
        )}

        {state === 'signUpForm.passwordDoNotMatch' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signUpForm.passwordDoNotMatch',
              defaultMessage: 'Passwords do not match',
            })}
          </Alert>
        )}

        {state === 'signUpForm.error' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.signUpForm.error',
              defaultMessage: 'Signing in failed. Please try again later',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailAndPassword.signUpForm.submitButton',
            defaultMessage: 'Create',
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
          defaultMessage: 'Back',
        })}
      </Button>
    </>
  )
}

export default SignUpForm
