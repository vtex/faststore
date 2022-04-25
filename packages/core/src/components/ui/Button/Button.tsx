import { Button as UIButton, Icon as UIIcon } from '@faststore/ui'
import type { ReactNode } from 'react'
import type { ButtonProps } from '@faststore/ui'

export type Variant = 'primary' | 'secondary' | 'tertiary'
export type Size = 'small' | 'regular'
export type IconPosition = 'left' | 'right'

export type UIButtonProps = {
  variant?: Variant
  size?: Size
  inverse?: boolean
  icon?: ReactNode
  iconPosition?: IconPosition
}

type Props = ButtonProps & UIButtonProps

function Button({
  variant,
  size = 'regular',
  inverse,
  icon,
  iconPosition,
  children,
  ...props
}: Props) {
  return (
    <UIButton
      data-fs-button
      data-fs-button-variant={variant}
      data-fs-button-size={size}
      data-fs-button-inverse={inverse}
      {...props}
    >
      {iconPosition === 'left' && <UIIcon component={icon} />}
      {children}
      {iconPosition === 'right' && <UIIcon component={icon} />}
    </UIButton>
  )
}

export default Button
