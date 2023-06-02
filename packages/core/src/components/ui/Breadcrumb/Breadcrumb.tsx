import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { memo } from 'react'

import Link from 'src/components/ui/Link'

import { Components, Props } from 'src/components/sections/Breadcrumb/Overrides'
const { Breadcrumb: BreadcrumbWrapper, Icon } = Components

export interface BreadcrumbProps extends UIBreadcrumbProps {
  icon: string
  alt: string
}

const Breadcrumb = ({
  icon = Props['Icon'].name ?? 'Home',
  alt = 'Go to homepage',
  ...otherProps
}: BreadcrumbProps) => (
  <BreadcrumbWrapper
    homeLink={
      <Link
        data-fs-breadcrumb-link
        data-fs-breadcrumb-link-home
        aria-label={alt}
        href="/"
        prefetch={false}
      >
        <Icon
          width={18}
          height={18}
          weight="bold"
          {...Props['Icon']}
          name={icon}
        />
      </Link>
    }
    renderLink={({ itemProps: { item: link, name } }) => (
      <Link data-fs-breadcrumb-link href={link} prefetch={false}>
        {name}
      </Link>
    )}
    {...Props['Breadcrumb']}
    {...otherProps}
  />
)

export default memo(Breadcrumb)
