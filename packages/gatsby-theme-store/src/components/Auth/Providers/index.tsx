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

const ExternalProvider = lazy(() => import('./ExternalProvider'))
const EmailAndPassword = lazy(() => import('./EmailAndPassword'))
const EmailVerification = lazy(() => import('./EmailVerification'))

type Provider =
  | 'Google'
  | 'Facebook'
  | 'CustomProvider'
  | 'NoState'
  | 'EmailAndPassword'
  | 'EmailVerification'

const None: FunctionComponent = () => null

export const AUTH_PROVIDERS: Record<
  Provider,
  {
    Component: FunctionComponent<AuthProviderComponentProps>
    Button: FunctionComponent<AuthProviderButtonProps>
  }
> = {
  NoState: {
    Component: None,
    Button: None,
  },
  CustomProvider: {
    Component: ExternalProvider,
    Button: None,
  },
  EmailAndPassword: {
    Component: EmailAndPassword,
    Button: EmailAndPasswordButton,
  },
  EmailVerification: {
    Component: EmailVerification,
    Button: EmailVerificationButton,
  },
  Google: {
    Component: ExternalProvider,
    Button: GoogleOAuthButton,
  },
  Facebook: {
    Component: ExternalProvider,
    Button: FacebookOAuthButton,
  },
}
