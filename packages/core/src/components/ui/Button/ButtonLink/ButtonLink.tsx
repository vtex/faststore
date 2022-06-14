import { useRef } from 'react'
import type { FocusEvent } from 'react'
import { Icon as UIIcon } from '@faststore/ui'

import Link from 'src/components/ui/Link'
import type { LinkProps } from 'src/components/ui/Link'

import type { ButtonProps } from '../Button'
import styles from '../button.module.scss'

type ButtonLinkProps = ButtonProps & Omit<LinkProps, 'variant'>

function ButtonLink({
  variant = 'primary',
  inverse,
  icon,
  iconPosition,
  children,
  disabled = false,
  ...otherProps
}: ButtonLinkProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  return (
    <Link
      ref={linkRef}
      className={styles.fsButton}
      data-fs-button
      data-fs-button-link
      data-fs-button-variant={variant}
      data-fs-button-inverse={inverse}
      data-fs-button-disabled={disabled}
      onFocus={(e: FocusEvent) => {
        e.preventDefault()

        if (disabled) {
          linkRef.current?.blur()
        }
      }}
      {...otherProps}
    >
      {iconPosition === 'left' && <UIIcon component={icon} />}
      {children}
      {iconPosition === 'right' && <UIIcon component={icon} />}
    </Link>
  )
}

export default ButtonLink
