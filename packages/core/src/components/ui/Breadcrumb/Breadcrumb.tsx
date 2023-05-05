import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { Icon, Breadcrumb as UIBreadcrumb } from '@faststore/ui'
import { memo } from 'react'

import Link from 'src/components/ui/Link'

interface BreadcrumbProps extends UIBreadcrumbProps {
  icon: string
  alt: string
}

const Breadcrumb = ({
  icon = 'Home',
  alt = 'Go to homepage',
  ...otherProps
}: BreadcrumbProps) => (
  <UIBreadcrumb
    homeLink={
      <Link
        data-fs-breadcrumb-link
        data-fs-breadcrumb-link-home
        aria-label={`${alt}`}
        href="/"
      >
        <Icon name={`${icon}`} width={18} height={18} weight="bold" />
      </Link>
    }
    renderLink={({ itemProps: { item: link, name } }) => (
      <Link data-fs-breadcrumb-link href={link}>
        {name}
      </Link>
    )}
    {...otherProps}
  ></UIBreadcrumb>
)

export default memo(Breadcrumb)
