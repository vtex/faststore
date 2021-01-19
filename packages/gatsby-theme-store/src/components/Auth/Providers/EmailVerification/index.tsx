import React, { useReducer } from 'react'
import type { FC } from 'react'
import {
  EmailVerificationAccessCodeForm as AccessCodeForm,
  EmailVerificationEmailForm as EmailForm,
  EmailVerificationReducer as reducer,
} from '@vtex/store-ui'
import type { AuthProviderComponentProps } from '@vtex/store-ui'

import { sendAccessKey, validateAccessKey } from '../../../../sdk/auth/Service'
import { useOnLoginSuccessful } from '../../../../sdk/auth/useOnLoginSuccessful'
import { useStartLogin } from '../../../../sdk/auth/useStartLogin'
import { isValidAccessCode, isValidEmail } from '../../../../sdk/auth/validate'

const EmailVerification: FC<AuthProviderComponentProps> = ({
  variant: v,
  returnUrl,
}) => {
  const [state, dispatch] = useReducer(reducer, { state: 'emailForm' })
  const onLoginSuccessful = useOnLoginSuccessful()
  const startLogin = useStartLogin()

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
