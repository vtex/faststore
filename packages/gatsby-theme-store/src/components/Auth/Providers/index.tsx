import { lazy } from 'react'
import type { FunctionComponent } from 'react'
import {
  EmailAndPasswordButton,
  EmailVerificationButton,
  FacebookOAuthButton,
  GoogleOAuthButton,
} from '@vtex/store-ui'
import type {
  AuthProviderButtonProps,
  AuthProviderComponentProps,
} from '@vtex/store-ui'

const EmailAndPassword = lazy(() => import('./EmailAndPassword'))

const EmailVerification = lazy(() => import('./EmailVerification'))

const FacebookOAuth = lazy(() => import('./Facebook'))
const GoogleOAuth = lazy(() => import('./Google'))

export const AUTH_PROVIDERS: Array<{
  Component: FunctionComponent<AuthProviderComponentProps>
  Button: FunctionComponent<AuthProviderButtonProps>
}> = [
  {
    Component: EmailAndPassword,
    Button: EmailAndPasswordButton,
  },
  {
    Component: EmailVerification,
    Button: EmailVerificationButton,
  },
  {
    Component: GoogleOAuth,
    Button: GoogleOAuthButton,
  },
  {
    Component: FacebookOAuth,
    Button: FacebookOAuthButton,
  },
]
