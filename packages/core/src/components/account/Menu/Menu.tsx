import { Button } from '@faststore/ui'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Link from 'src/components/ui/Link'
import styles from '../section.module.scss'

import { OrganizationDrawer } from '../Drawer/OrganizationDrawer/OrganizationDrawer'
import { useAccountNavigationLabels } from 'src/sdk/account/accountPageContext'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'

interface NavItem {
  title: string
  route: string
}

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  avatarImageUrl?: string
  accountName: string
  items: NavItem[]
}

const Nav = ({ items }: Pick<MenuProps, 'items'>) => {
  const router = useRouter()
  const currentRoute = router.pathname

  return (
    <ul className={styles.nav}>
      {items.map(({ route, title }) => (
        <li
          className={styles.navItem}
          data-is-selected={currentRoute.includes(route)}
          key={route}
        >
          <Link href={route} tabIndex={0}>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

const Menu = ({ avatarImageUrl, accountName, items }: MenuProps) => {
  const { isDesktop } = useScreenResize()
  const navigationLabels = useAccountNavigationLabels()
  const switchLabel = navigationLabels?.switchLabel ?? 'Switch'
  const { b2b } = useSession()
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const canSwitchContract = Boolean(b2b?.unitId)

  return (
    <div className={styles.menu}>
      {isDesktop ? (
        <div className={styles.account}>
          <div className={styles.avatarContainer}>
            {avatarImageUrl ? (
              <img className={styles.avatar} src={avatarImageUrl} />
            ) : (
              <span className={styles.avatar}>{accountName?.[0]}</span>
            )}
            <h2>{accountName}</h2>
          </div>
          {canSwitchContract && (
            <Button
              className={styles.switchButton}
              variant="secondary"
              size="small"
              onClick={() => setIsSwitcherOpen(true)}
            >
              {switchLabel}
            </Button>
          )}
        </div>
      ) : null}
      <Nav items={items} />
      {isSwitcherOpen && (
        <OrganizationDrawer
          isOpen
          closeDrawer={() => setIsSwitcherOpen(false)}
          isRepresentative={Boolean(b2b?.isRepresentative)}
          initialView="switch"
        />
      )}
    </div>
  )
}

export default Menu
