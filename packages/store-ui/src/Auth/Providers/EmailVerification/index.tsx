import React, { useReducer } from 'react'
import type { FC } from 'react'

import type { AuthProviderComponentProps } from '../types'
import { reducer } from './state'
import EmailForm from './EmailForm'
import AccessCodeForm from './AccessCodeForm'

interface Props extends AuthProviderComponentProps {
  sendAccessKey: (opts: { email: string }) => Promise<void>
  validateAccessKey: (opts: {
    accessKey: string
    login: string
  }) => Promise<void>
  isValidAccessCode: (code: string) => boolean
  isValidEmail: (email: string) => boolean
  startLogin: (opts: { user: string }) => Promise<void>
  onLoginSuccessful: (returnUrl: string | undefined) => Promise<void>
}

const EmailVerification: FC<Props> = ({
  variant: v,
  returnUrl,
  sendAccessKey,
  validateAccessKey,
  isValidAccessCode,
  isValidEmail,
  startLogin,
  onLoginSuccessful,
}) => {
  const [state, dispatch] = useReducer(reducer, { state: 'emailForm' })

  const variant = `emailVerification.${v}`

  return state.state.startsWith('emailForm') ? (
    <EmailForm
      state={state}
      variant={variant}
      onSubmit={async (email: string) => {
        if (!isValidEmail(email)) {
          dispatch({ type: 'emailForm.invalidEmailInput' })

          return
        }

        try {
          await startLogin({ user: email })
          await sendAccessKey({ email })

          dispatch({ type: 'accessCodeForm', email })
        } catch (err) {
          dispatch({ type: 'emailForm.authError' })
        }
      }}
    />
  ) : (
    <AccessCodeForm
      state={state}
      variant={variant}
      onBack={() => dispatch({ type: 'emailForm' })}
      onSubmit={async (code: string) => {
        const { email } = state

        if (!isValidAccessCode(code)) {
          dispatch({ type: 'accessCodeForm.invalidAccessCode' })

          return
        }

        if (!email) {
          dispatch({ type: 'emailForm.invalidEmailInput' })

          return
        }

        try {
          await validateAccessKey({
            accessKey: code,
            login: email,
          })

          onLoginSuccessful(returnUrl)
        } catch (err) {
          dispatch({ type: 'accessCodeForm.authError' })
        }
      }}
    />
  )
}

export default EmailVerification
