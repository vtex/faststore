import React, { FC, useReducer } from 'react'

import {
  sendAccessKey,
  setPassword,
  startLogin,
} from '../../../../sdk/auth/Service'
import { validatePassword } from '../../../../sdk/auth/Service/validatePassword'
import { onLoginSuccessful } from '../../../../sdk/auth/utils'
import {
  isValidAccessCode,
  isValidEmail,
  isValidPassword,
} from '../../../../sdk/auth/validate'
import { AuthProviderComponentProps } from '../types'
import EmailForm from './EmailForm'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import { reducer } from './state'

const EmailAndPassword: FC<AuthProviderComponentProps> = ({
  variant: v,
  returnUrl,
}) => {
  const [state, dispatch] = useReducer(reducer, { state: 'signInForm' })
  const variant = `emailAndPassword.${v}`

  return state.state.startsWith('emailForm') ? (
    <EmailForm
      state={state}
      variant={variant}
      onBack={() => dispatch({ type: 'signInForm' })}
      onSubmit={async (email) => {
        if (!isValidEmail(email)) {
          dispatch({ type: 'emailForm.invalidEmailInput' })
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
        }

        if (!isValidPassword(password)) {
          dispatch({ type: 'signUpForm.invalidPassword' })
        }

        if (password !== confirmPassword) {
          dispatch({ type: 'signUpForm.passwordDoNotMatch' })
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
        }

        if (!isValidPassword(password)) {
          dispatch({ type: 'signInForm.invalidPasswordInput' })
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
