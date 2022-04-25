import { Link as UILink } from '@faststore/ui'
import type { ElementType } from 'react'
import type { LinkProps } from '@faststore/ui'

import FrameworkLink from 'src/components/common/Link'

type Variant = 'default' | 'display' | 'inline' | 'footer'

type Props<T extends ElementType = typeof FrameworkLink> = LinkProps<T> & {
  variant?: Variant
  inverse?: boolean
}

function Link<T extends ElementType = typeof FrameworkLink>({
  variant = 'default',
  inverse,
  href,
  ...props
}: Props<T>) {
  return (
    <UILink
      as={FrameworkLink}
      data-fs-link
      data-fs-link-variant={variant}
      data-fs-link-inverse={inverse}
      href={href}
      {...props}
    />
  )
}

export default Link
