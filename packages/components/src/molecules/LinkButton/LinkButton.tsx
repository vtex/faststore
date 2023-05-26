import type { AnchorHTMLAttributes, FocusEvent } from 'react'
import React, { useRef } from 'react'

import type { ButtonProps } from '../..'

export type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonProps

function LinkButton({
  icon,
  inverse,
  children,
  disabled,
  iconPosition,
  size = 'regular',
  variant = 'primary',
  testId = 'fs-link-button',
  ...otherProps
}: LinkButtonProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  function onFocus(e: FocusEvent) {
    e.preventDefault()

    if (disabled) {
      linkRef.current?.blur()
    }
  }

  return (
    <a
      ref={linkRef}
      data-fs-button
      data-fs-link-button
      data-fs-button-size={size}
      data-fs-button-variant={variant}
      data-fs-button-inverse={inverse}
      data-fs-button-disabled={disabled}
      onFocus={onFocus}
      data-testid={testId}
      {...otherProps}
    >
      <div data-fs-button-wrapper>
        {!!icon && iconPosition === 'left' && (
          <span data-fs-button-icon>{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!!icon && iconPosition === 'right' && (
          <span data-fs-button-icon>{icon}</span>
        )}
      </div>
    </a>
  )
}

export default LinkButton
