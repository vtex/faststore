import React, { useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Alert, Box, Button, Input } from 'theme-ui'
import type { FC } from 'react'

import type { State } from './state'

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
        <FormattedMessage id="login.page.emailAndPassword.emailForm.title" />
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
          id="emailform-email"
          placeholder={formatMessage({
            id: 'login.page.emailAndPassword.emailForm.emailPlaceholder',
          })}
        />

        {state === 'emailForm.invalidEmailInput' && (
          <Alert variant="signInDanger">
            <FormattedMessage id="login.page.emailAndPassword.emailForm.invalidEmailInput" />
          </Alert>
        )}

        {state === 'emailForm.error' && (
          <Alert variant="signInDanger">
            <FormattedMessage id="login.page.emailAndPassword.emailForm.error" />
          </Alert>
        )}

        <Button>
          <FormattedMessage id="login.page.emailAndPassword.emailForm.submitButton" />
        </Button>
      </Box>
      <Button
        onClick={(e) => {
          e.preventDefault()
          onBack()
        }}
      >
        <FormattedMessage id="login.page.emailAndPassword.emailForm.backButton" />
      </Button>
    </>
  )
}

export default EmailForm
