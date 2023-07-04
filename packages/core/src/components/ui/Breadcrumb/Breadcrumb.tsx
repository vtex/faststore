import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { memo } from 'react'

import Link from 'src/components/ui/Link'

import {
  Breadcrumb as BreadcrumbWrapper,
  Icon,
} from 'src/components/sections/Breadcrumb/Overrides'

export interface BreadcrumbProps extends UIBreadcrumbProps {
  icon: string
  alt: string
}

const Breadcrumb = ({
  icon = Icon.props.name ?? 'Home',
  alt = 'Go to homepage',
  ...otherProps
}: BreadcrumbProps) => (
  <BreadcrumbWrapper.Component
    homeLink={
      <Link
        data-fs-breadcrumb-link
        data-fs-breadcrumb-link-home
        aria-label={alt}
        href="/"
        prefetch={false}
      >
        <Icon.Component
          width={18}
          height={18}
          weight="bold"
          {...Icon.props}
          name={icon}
        />
      </Link>
    }
    renderLink={({ itemProps: { item: link, name } }) => (
      <Link data-fs-breadcrumb-link href={link} prefetch={false}>
        {name}
      </Link>
    )}
    {...BreadcrumbWrapper.props}
    {...otherProps}
  />
)

export default memo(Breadcrumb)
