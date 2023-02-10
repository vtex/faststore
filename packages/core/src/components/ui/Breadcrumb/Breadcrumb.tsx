import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { Breadcrumb as UIBreadcrumb } from '@faststore/ui'
import { memo } from 'react'

import Icon from 'src/components/ui/Icon'
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

function Breadcrumb({ breadcrumbList, ...otherProps }: BaseBreadcrumbProps) {
  breadcrumbList = [
    { item: '/technology/', name: 'Technology', position: 1 },
    {
      item: '/aedle-vk1-headphone-99988211/p',
      name: 'Aedle VK-1 L Headphone',
      position: 2,
    },
    {
      item: '/aedle-vk1-headphone-99988211/p',
      name: 'Aedle VK-1 L Headphone',
      position: 3,
    },
    {
      item: '/aedle-vk1-headphone-99988211/p',
      name: 'Aedle VK-1 L Headphone',
      position: 4,
    },
    {
      item: '/aedle-vk1-headphone-99988211/p',
      name: 'Aedle VK-1 L Headphone',
      position: 5,
    },
    {
      item: '/aedle-vk1-headphone-99988211/p',
      name: 'Aedle VK-1 L Headphone',
      position: 6,
    },
  ]

  return (
    <UIBreadcrumb
      breadcrumbList={breadcrumbList}
      homeLink={
        <Link aria-label="Go to homepage" href="/">
          <Icon name="House" width={18} height={18} weight="bold" />
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
}

export default memo(Breadcrumb)
