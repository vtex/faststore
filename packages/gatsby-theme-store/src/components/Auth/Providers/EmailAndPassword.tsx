import { EmailAndPasswordProvider } from '@vtex/store-ui'
import React from 'react'
import type { AuthProviderComponentProps } from '@vtex/store-ui'
import type { FC } from 'react'

import { useOnLoginSuccessful } from '../../../sdk/auth/useOnLoginSuccessful'
import { useStartLogin } from '../../../sdk/auth/useStartLogin'
import {
  sendAccessKey,
  setPassword,
  validatePassword,
} from '../../../sdk/auth/Service'
import {
  isValidAccessCode,
  isValidEmail,
  isValidPassword,
} from '../../../sdk/auth/validate'

const EmailAndPassword: FC<AuthProviderComponentProps> = (props) => {
  const startLogin = useStartLogin()
  const onLoginSuccessful = useOnLoginSuccessful()

  return (
    <EmailAndPasswordProvider
      {...props}
      setPassword={setPassword}
      validatePassword={validatePassword}
      isValidAccessCode={isValidAccessCode}
      isValidEmail={isValidEmail}
      isValidPassword={isValidPassword}
      sendAccessKey={sendAccessKey}
      startLogin={startLogin}
      onLoginSuccessful={onLoginSuccessful}
    />
  )
}

export default EmailAndPassword
