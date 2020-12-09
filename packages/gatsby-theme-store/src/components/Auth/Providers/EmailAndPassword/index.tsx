import React, { useReducer } from 'react'
import type { FC } from 'react'

import { sendAccessKey, setPassword } from '../../../../sdk/auth/Service'
import { validatePassword } from '../../../../sdk/auth/Service/validatePassword'
import { useOnLoginSuccessful } from '../../../../sdk/auth/useOnLoginSuccessful'
import { useStartLogin } from '../../../../sdk/auth/useStartLogin'
import {
  isValidAccessCode,
  isValidEmail,
  isValidPassword,
} from '../../../../sdk/auth/validate'
import EmailForm from './EmailForm'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import { reducer } from './state'
import type { AuthProviderComponentProps } from '../types'

const EmailAndPassword: FC<AuthProviderComponentProps> = ({
  variant: v,
  returnUrl,
}) => {
  const [state, dispatch] = useReducer(reducer, { state: 'signInForm' })
  const onLoginSuccessful = useOnLoginSuccessful()
  const startLogin = useStartLogin()
  const variant = `emailAndPassword.${v}`

  return state.state.startsWith('emailForm') ? (
    <EmailForm
      state={state}
      variant={variant}
      onBack={() => dispatch({ type: 'signInForm' })}
      onSubmit={async (email) => {
        if (!isValidEmail(email)) {
          dispatch({ type: 'emailForm.invalidEmailInput' })

          return
        }

        try {
          await startLogin({ user: email })
          await sendAccessKey({ email })

          dispatch({ type: 'signUpForm', email })
        } catch (err) {
          dispatch({ type: 'emailForm.error' })
        }
      }}
    />
  ) : state.state.startsWith('signUpForm') ? (
    <SignUpForm
      state={state}
      variant={variant}
      onBack={() => dispatch({ type: 'signInForm' })}
      onSubmit={async (code, password, confirmPassword) => {
        if (!isValidAccessCode(code)) {
          dispatch({ type: 'signUpForm.invalidAccessCodeInput' })

          return
        }

        if (!isValidPassword(password).passwordIsValid) {
          dispatch({ type: 'signUpForm.invalidPassword' })

          return
        }

        if (password !== confirmPassword) {
          dispatch({ type: 'signUpForm.passwordDoNotMatch' })

          return
        }

        try {
          await setPassword({
            login: state.email!,
            newPassword: password,
            accesskey: code,
          })

          onLoginSuccessful(returnUrl)
        } catch {
          dispatch({ type: 'signUpForm.error' })
        }
      }}
    />
  ) : (
    <SignInForm
      state={state}
      variant={variant}
      onSubmit={async (email, password) => {
        if (!isValidEmail(email)) {
          dispatch({ type: 'signInForm.invalidEmailInput' })

          return
        }

        if (!isValidPassword(password).passwordIsValid) {
          dispatch({ type: 'signInForm.invalidPasswordInput' })

          return
        }

        try {
          await startLogin({ user: email })
          await validatePassword({ login: email, password })

          onLoginSuccessful(returnUrl)
        } catch {
          dispatch({ type: 'signInForm.authError' })
        }
      }}
      onForgotPassword={() => dispatch({ type: 'emailForm' })}
      onSignUp={() => dispatch({ type: 'emailForm' })}
    />
  )
}

export default EmailAndPassword
