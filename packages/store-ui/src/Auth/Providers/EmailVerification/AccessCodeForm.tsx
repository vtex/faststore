import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Alert, Box, Button, Input } from 'theme-ui'
import React, { useRef } from 'react'
import type { FC } from 'react'

import type { State } from './state'

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
          })}
        />

        {state === 'accessCodeForm.invalidAccessCode' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id:
                'login.page.emailVerification.accessCodeForm.invalidAccessCode',
            })}
          </Alert>
        )}

        {state === 'accessCodeForm.authError' && (
          <Alert variant="signInDanger">
            {formatMessage({
              id: 'login.page.emailVerification.accessCodeForm.authError',
            })}
          </Alert>
        )}

        <Button>
          {formatMessage({
            id: 'login.page.emailVerification.accessCodeForm.submitButton',
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
        })}
      </Button>
    </>
  )
}

export default AccessCodeForm
