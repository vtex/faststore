import React, { useRef } from 'react'
import type { FocusEvent, HTMLAttributes } from 'react'

import { Icon } from '../..'
import type { ButtonProps } from '../..'

export type LinkButtonProps = HTMLAttributes<HTMLAnchorElement> & ButtonProps

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
      onFocus={onFocus}
      data-fs-button
      data-fs-link-button
      data-testid={testId}
      data-fs-button-size={size}
      data-fs-button-variant={variant}
      data-fs-button-inverse={inverse}
      data-fs-button-disabled={disabled}
      {...otherProps}
    >
      {iconPosition === 'left' && <Icon component={icon} />}
      {children}
      {iconPosition === 'right' && <Icon component={icon} />}
    </a>
  )
}

export default LinkButton
