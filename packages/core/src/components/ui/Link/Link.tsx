import { Link as UILink } from '@faststore/ui'
import type { ElementType } from 'react'
import type { LinkProps as UILinkProps } from '@faststore/ui'

import FrameworkLink from 'src/components/common/Link'

import styles from './link.module.scss'

type Variant = 'default' | 'display' | 'footer' | 'inline'

export type LinkProps<T extends ElementType = typeof FrameworkLink> =
  UILinkProps<T> & {
    variant?: Variant
    inverse?: boolean
  }

function Link<T extends ElementType = typeof FrameworkLink>({
  variant = 'default',
  inverse,
  href,
  ...otherProps
}: LinkProps<T>) {
  return (
    <UILink
      as={FrameworkLink}
      data-fs-link
      data-fs-link-variant={variant}
      data-fs-link-inverse={inverse}
      className={styles.fsLink}
      href={href}
      {...otherProps}
    />
  )
}

export default Link
