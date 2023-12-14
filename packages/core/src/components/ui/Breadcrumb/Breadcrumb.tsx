import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { memo } from 'react'

import Link from 'src/components/ui/Link'

import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

export interface BreadcrumbProps extends UIBreadcrumbProps {
  icon: string
  alt: string
}

const Breadcrumb = ({
  icon,
  alt = 'Go to homepage',
  ...otherProps
}: BreadcrumbProps) => {
  const { Breadcrumb: BreadcrumbWrapper, Icon } =
    useOverrideComponents<'Breadcrumb'>()

  return (
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
            name={icon ?? Icon.props.name ?? 'Home'}
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
}

export default memo(Breadcrumb)
