import type { ButtonProps } from 'theme-ui'

export interface AuthProviderComponentProps {
  variant: string
  returnUrl?: string
  providerName: 'Google' | 'Facebook'
}

export type AuthProviderButtonProps = ButtonProps
