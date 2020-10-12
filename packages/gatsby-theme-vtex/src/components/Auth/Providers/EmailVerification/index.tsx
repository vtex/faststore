import React, { FC, useReducer } from 'react'

import {
  sendAccessKey,
  startLogin,
  validateAccessKey,
} from '../../../../sdk/auth/Service'
import { onLoginSuccessful } from '../../../../sdk/auth/utils'
import { isValidAccessCode, isValidEmail } from '../../../../sdk/auth/validate'
import { AuthProviderComponentProps } from '../types'
import AccessCodeForm from './AccessCodeForm'
import EmailForm from './EmailForm'
import { reducer } from './state'

const EmailVerification: FC<AuthProviderComponentProps> = ({
  variant: v,
  returnUrl,
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
