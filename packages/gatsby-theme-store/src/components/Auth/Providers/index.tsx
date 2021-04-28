import {
  EmailAndPasswordButton,
  EmailVerificationButton,
  FacebookOAuthButton,
  GoogleOAuthButton,
} from '@vtex/store-ui'
import { lazy } from 'react'
import type { ComponentType } from 'react'
import type {
  AuthProviderButtonProps,
  AuthProviderComponentProps,
} from '@vtex/store-ui'

const ExternalProvider = lazy(() => import('./External'))
const EmailAndPassword = lazy(() => import('./EmailAndPassword'))
const EmailVerification = lazy(() => import('./EmailVerification'))

type Provider =
  | 'Google'
  | 'Facebook'
  | 'CustomProvider'
  | 'NoState'
  | 'EmailAndPassword'
  | 'EmailVerification'

const None: ComponentType = () => null

export const AUTH_PROVIDERS: Record<
  Provider,
  {
    Component: ComponentType<AuthProviderComponentProps>
    Button: ComponentType<AuthProviderButtonProps>
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
