import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Alert, Box, Button, Input } from 'theme-ui'
import React, { useRef } from 'react'
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
        {formatMessage({
          id: 'login.page.emailAndPassword.emailForm.title',
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
            id: 'login.page.emailAndPassword.emailForm.emailPlaceholder',
          })}
        />

        {state === 'emailForm.invalidEmailInput' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.emailForm.invalidEmailInput',
            })}
          </Alert>
        )}

        {state === 'emailForm.error' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailAndPassword.emailForm.error',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailAndPassword.emailForm.submitButton',
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
        })}
      </Button>
    </>
  )
}

export default EmailForm
