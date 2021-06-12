import type { ButtonProps } from 'theme-ui'

export interface AuthProviderComponentProps {
  variant: string
  returnUrl?: string
  providerName?: string
}

export type AuthProviderButtonProps = ButtonProps
