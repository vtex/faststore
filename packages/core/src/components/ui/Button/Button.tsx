import { Button as UIButton, Icon as UIIcon } from '@faststore/ui'
import type { ReactNode, AriaAttributes } from 'react'
import type { ButtonProps as UIButtonProps } from '@faststore/ui'

import styles from './button.module.scss'

export type Variant = 'primary' | 'secondary' | 'tertiary'
export type Size = 'small' | 'regular'
export type IconPosition = 'left' | 'right'

export interface ButtonProps
  extends Omit<UIButtonProps, 'aria-label' | 'disabled'> {
  /**
   * Specifies the component variant
   */
  variant?: Variant
  /**
   * Specifies the size variant
   */
  size?: Size
  /**
   * Defines use of inverted colors
   */
  inverse?: boolean
  /**
   * Icon component
   */
  icon?: ReactNode
  /**
   * Specifies where the icon should be positioned
   */
  iconPosition?: IconPosition
  /**
   * For accessibility purposes, defines an ARIA label to the element when no label is provided
   */
  'aria-label'?: AriaAttributes['aria-label']
  /**
   * Specifies that this button should be disabled
   */
  disabled?: boolean
}

function Button({
  variant,
  size = 'regular',
  inverse,
  icon,
  iconPosition,
  children,
  'aria-label': ariaLabel,
  disabled,
  ...props
}: ButtonProps) {
  const isButtonIcon = icon && !iconPosition

  return (
    <UIButton
      aria-label={ariaLabel}
      className={styles.fsButton}
      data-fs-button
      data-fs-button-inverse={inverse}
      data-fs-button-size={size}
      data-fs-button-variant={variant}
      disabled={disabled}
      {...props}
    >
      {(isButtonIcon || iconPosition === 'left') && <UIIcon component={icon} />}
      {children}
      {iconPosition === 'right' && <UIIcon component={icon} />}
    </UIButton>
  )
}

export default Button
