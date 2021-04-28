import React, { useReducer } from 'react'
import type { FC } from 'react'

import EmailForm from './EmailForm'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import { reducer } from './state'
import type { AuthProviderComponentProps } from '../types'

interface Props extends AuthProviderComponentProps {
  isValidAccessCode: (code: string) => boolean
  isValidEmail: (email: string) => boolean
  isValidPassword: (pwd: string) => { passwordIsValid: boolean }
  sendAccessKey: (opts: { email: string }) => Promise<void>
  setPassword: (opts: {
    login: string
    newPassword: string
    accesskey: string
  }) => Promise<void>
  validatePassword: (opts: { login: string; password: string }) => void
  startLogin: (opts: { user: string }) => Promise<void>
  onLoginSuccessful: (returnUrl: string | undefined) => Promise<void>
}

const EmailAndPassword: FC<Props> = ({
  variant: v,
  returnUrl,
  isValidAccessCode,
  isValidEmail,
  isValidPassword,
  sendAccessKey,
  setPassword,
  validatePassword,
  startLogin,
  onLoginSuccessful,
}) => {
  const [state, dispatch] = useReducer(reducer, { state: 'signInForm' })
  // const onLoginSuccessful = useOnLoginSuccessful()
  // const startLogin = useStartLogin()
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
