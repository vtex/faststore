import React, { useRef } from 'react'
import type { FocusEvent } from 'react'

import { Icon, Link } from '../..'
import type { LinkProps, ButtonProps } from '../..'

export type LinkButtonProps = ButtonProps & Omit<LinkProps, 'variant'>

function LinkButton({
  icon,
  inverse,
  children,
  disabled,
  iconPosition,
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
    <Link
      ref={linkRef}
      data-testid={testId}
      data-fs-button
      data-fs-link-button
      data-fs-button-variant={variant}
      data-fs-button-inverse={inverse}
      data-fs-button-disabled={disabled}
      onFocus={onFocus}
      {...otherProps}
    >
      {iconPosition === 'left' && <Icon component={icon} />}
      {children}
      {iconPosition === 'right' && <Icon component={icon} />}
    </Link>
  )
}

export default LinkButton
