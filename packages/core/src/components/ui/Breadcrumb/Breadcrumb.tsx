import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { Icon, Breadcrumb as UIBreadcrumb } from '@faststore/ui'
import { memo } from 'react'

import Link from 'src/components/ui/Link'

type ItemElement = {
  item: string
  name: string
  position: number
}
export interface BreadcrumbProps extends UIBreadcrumbProps {
  /**
   * Array of ItemElement that represents each breadcrumb item.
   */
  breadcrumbList: ItemElement[]
}

interface BaseBreadcrumbProps extends BreadcrumbProps {
  isDesktop?: boolean
}

const Breadcrumb = ({ breadcrumbList, ...otherProps }: BaseBreadcrumbProps) => (
  <UIBreadcrumb
    breadcrumbList={breadcrumbList}
    homeLink={
      <Link aria-label="Go to homepage" href="/" prefetch={false}>
        <Icon name="House" width={18} height={18} weight="bold" />
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
