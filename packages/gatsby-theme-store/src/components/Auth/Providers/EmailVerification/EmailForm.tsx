import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Alert, Box, Button, Input } from '@vtex/store-ui'
import React, { useRef } from 'react'
import type { FC } from 'react'

import type { State } from './state'

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
          id="emailform-email"
          placeholder={formatMessage({
            id: 'login.page.emailVerification.emailForm.emailPlaceholder',
          })}
        />

        {state === 'emailForm.invalidEmailInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailVerification.emailForm.invalidEmailInput',
            })}
          </Alert>
        )}

        {state === 'emailForm.authError' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailVerification.emailForm.error',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailVerification.emailForm.submitButton',
          })}
        </Button>
      </Box>
    </>
  )
}

export default EmailForm
