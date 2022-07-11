import type { BreadcrumbProps as UIBreadcrumbProps } from '@faststore/ui'
import { Breadcrumb as UIBreadcrumb } from '@faststore/ui'
import { useRouter } from 'next/router'
import { memo } from 'react'

import Dropdown, {
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from 'src/components/ui/Dropdown'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'

import styles from './breadcrumb.module.scss'

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

function BaseBreadcrumb({
  breadcrumbList,
  isDesktop = false,
}: BaseBreadcrumbProps) {
  const router = useRouter()
  const firstItem = isDesktop ? breadcrumbList[0] : null
  const mediumItems = isDesktop
    ? breadcrumbList.slice(1, -2)
    : breadcrumbList.slice(0, -2)

  const lastItems = breadcrumbList.slice(-2)

  const collapseBreadcrumb = breadcrumbList.length > 4

  return (
    <UIBreadcrumb
      divider=""
      className={`${styles.fsBreadcrumb} ${
        isDesktop ? 'hidden-mobile' : 'display-mobile'
      }`}
    >
      <Link
        data-fs-breadcrumb-link
        data-fs-breadcrumb-link-home
        aria-label="Go to homepage"
        href="/"
      >
        <Icon name="House" width={18} height={18} weight="bold" />
      </Link>

      {!collapseBreadcrumb &&
        breadcrumbList.map(({ item, name }, index) => {
          return breadcrumbList.length === index + 1 ? (
            <span key={String(index)}>{name}</span>
          ) : (
            <Link data-fs-breadcrumb-link href={item} key={String(index)}>
              {name}
            </Link>
          )
        })}

      {collapseBreadcrumb && firstItem && (
        <Link data-fs-breadcrumb-link href={firstItem.item}>
          {firstItem.name}
        </Link>
      )}

      {collapseBreadcrumb && (
        <Dropdown>
          <DropdownButton data-fs-breadcrumb-dropdown-button>
            <Icon name="DotsThree" width={24} height={24} />
          </DropdownButton>
          <DropdownMenu data-fs-breadcrumb-dropdown-menu>
            {mediumItems.map(({ item, name }, index) => (
              <DropdownItem
                data-fs-breadcrumb-dropdown-item
                icon={
                  <Icon name="ArrowElbowDownRight" width={24} height={24} />
                }
                onClick={() => router.push(item)}
                key={String(index)}
              >
                {name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}

      {collapseBreadcrumb &&
        lastItems.map(({ item, name }, index) => {
          return lastItems.length === index + 1 ? (
            <span key={String(index)}>{name}</span>
          ) : (
            <Link data-fs-breadcrumb-link href={item} key={String(index)}>
              {name}
            </Link>
          )
        })}
    </UIBreadcrumb>
  )
}

const Breadcrumb = ({ breadcrumbList }: BreadcrumbProps) => (
  <>
    <BaseBreadcrumb breadcrumbList={breadcrumbList} />
    <BaseBreadcrumb breadcrumbList={breadcrumbList} isDesktop />
  </>
)

export default memo(Breadcrumb)
