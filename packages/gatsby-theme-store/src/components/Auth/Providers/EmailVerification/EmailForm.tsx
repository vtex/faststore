import React, { FC, useRef } from 'react'
import { Alert, Box, Button, Input } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { State } from './state'

interface Props {
  variant: string
  onSubmit: (email: string) => Promise<void>
  state: State
}

const EmailForm: FC<Props> = ({ variant, state: { state }, onSubmit }) => {
  const { formatMessage } = useIntl()
  const input = useRef<HTMLInputElement>(null)

  return (
    <>
      <Box variant={`${variant}.title`}>
        {formatMessage({
          id: 'login.page.emailVerification.emailForm.title',
          defaultMessage: 'Receive access code by e-mail',
        })}
      </Box>
      <Box
        as="form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(input.current?.value ?? '')
        }}
        variant={variant}
      >
        <Input
          ref={input}
          type="email"
          name="email"
          id="email"
          placeholder={formatMessage({
            id: 'login.page.emailVerification.emailForm.emailPlaceholder',
            defaultMessage: 'Add your email',
          })}
        />

        {state === 'emailForm.invalidEmailInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailVerification.emailForm.invalidEmailInput',
              defaultMessage: 'Please insert a valid email',
            })}
          </Alert>
        )}

        {state === 'emailForm.authError' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailVerification.emailForm.error',
              defaultMessage: 'Something went wrong, please try again later',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailVerification.emailForm.submitButton',
            defaultMessage: 'Send',
          })}
        </Button>
      </Box>
    </>
  )
}

export default EmailForm
