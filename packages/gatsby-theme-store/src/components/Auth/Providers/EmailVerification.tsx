import type { AuthProviderComponentProps } from '@vtex/store-ui'
import { EmailVerificationProvider } from '@vtex/store-ui'
import type { FC } from 'react'
import React from 'react'

import { sendAccessKey, validateAccessKey } from '../../../sdk/auth/Service'
import { useOnLoginSuccessful } from '../../../sdk/auth/useOnLoginSuccessful'
import { useStartLogin } from '../../../sdk/auth/useStartLogin'
import { isValidAccessCode, isValidEmail } from '../../../sdk/auth/validate'

const EmailVerification: FC<AuthProviderComponentProps> = ({ ...rest }) => {
  const onLoginSuccessful = useOnLoginSuccessful()
  const startLogin = useStartLogin()

  return (
    <EmailVerificationProvider
      {...rest}
      sendAccessKey={sendAccessKey}
      validateAccessKey={validateAccessKey}
      isValidAccessCode={isValidAccessCode}
      isValidEmail={isValidEmail}
      startLogin={startLogin}
      onLoginSuccessful={onLoginSuccessful}
    />
  )
}

export default EmailVerification
