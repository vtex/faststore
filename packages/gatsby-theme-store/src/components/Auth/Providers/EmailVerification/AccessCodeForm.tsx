import React, { FC, useRef } from 'react'
import { Alert, Box, Button, Input } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { State } from './state'

interface Props {
  variant: string
  onSubmit: (email: string) => Promise<void>
  onBack: () => void
  state: State
}

const AccessCodeForm: FC<Props> = ({
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
          id: 'login.page.emailVerification.accessCodeForm.title',
          defaultMessage: 'Enter the access code sent to your e-mail',
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
          type="text"
          name="code"
          id="accesscodeform-code"
          placeholder={formatMessage({
            id: 'login.page.emailVerification.accessCodeForm.codePlaceholder',
            defaultMessage: 'Add your access code',
          })}
        />

        {state === 'accessCodeForm.invalidAccessCode' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id:
                'login.page.emailVerification.accessCodeForm.invalidAccessCode',
              defaultMessage: 'Insert a valid 6-digit access code',
            })}
          </Alert>
        )}

        {state === 'accessCodeForm.authError' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailVerification.accessCodeForm.authError',
              defaultMessage:
                'Something went wrong with your access code. Please recheck it and try again',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailVerification.accessCodeForm.submitButton',
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
          id: 'login.page.emailVerification.accessCodeForm.backButton',
          defaultMessage: 'Back',
        })}
      </Button>
    </>
  )
}

export default AccessCodeForm
