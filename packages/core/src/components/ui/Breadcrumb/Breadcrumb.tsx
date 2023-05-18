import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { Icon, Breadcrumb as UIBreadcrumb } from '@faststore/ui'
import { memo } from 'react'

import Link from 'src/components/ui/Link'

export interface BreadcrumbProps extends UIBreadcrumbProps {
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
        aria-label={alt}
        href="/"
        prefetch={false}
      >
        <Icon name={icon} width={18} height={18} weight="bold" />
      </Link>
    }
    renderLink={({ itemProps: { item: link, name } }) => (
      <Link data-fs-breadcrumb-link href={link} prefetch={false}>
        {name}
      </Link>
    )}
    {...otherProps}
  ></UIBreadcrumb>
)

export default memo(Breadcrumb)
