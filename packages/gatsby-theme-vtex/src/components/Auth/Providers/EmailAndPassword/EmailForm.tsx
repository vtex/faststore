import React, { FC, useRef } from 'react'
import { Alert, Box, Button, Input } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { State } from './state'

interface Props {
  variant: string
  state: State
  onBack: () => void
  onSubmit: (email: string) => Promise<void>
}

const EmailForm: FC<Props> = ({
  variant,
  state: { state },
  onSubmit,
  onBack,
}) => {
  const { formatMessage } = useIntl()
  const input = useRef<HTMLInputElement>(null)

  return (
    <>
      <Box variant={`${variant}.title`}>
        {formatMessage({
          id: 'login.page.emailAndPassword.emailForm.title',
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
            id: 'login.page.emailAndPassword.emailForm.emailPlaceholder',
            defaultMessage: 'Add your email',
          })}
        />

        {state === 'emailForm.invalidEmailInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.emailForm.invalidEmailInput',
              defaultMessage: 'Please insert a valid email',
            })}
          </Alert>
        )}

        {state === 'emailForm.error' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.emailForm.error',
              defaultMessage: 'Something went wrong, please try again later',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailAndPassword.emailForm.submitButton',
            defaultMessage: 'Confirm',
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
          id: 'login.page.emailAndPassword.emailForm.backButton',
          defaultMessage: 'Back',
        })}
      </Button>
    </>
  )
}

export default EmailForm
