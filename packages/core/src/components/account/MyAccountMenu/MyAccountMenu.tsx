import { Button, Link } from '@faststore/ui'
import { useRouter } from 'next/router'

import styles from '../section.module.scss'

import useScreenResize from 'src/sdk/ui/useScreenResize'

interface NavItem {
  title: string
  route: string
}

export interface MyAccountMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  avatarImageUrl?: string
  accountName: string
  items: NavItem[]
}

const Nav = ({ items }: Pick<MyAccountMenuProps, 'items'>) => {
  const router = useRouter()
  const currentRoute = router.pathname

  return (
    <ul className={styles.nav}>
      {items.map(({ route, title }) => (
        <li
          className={styles.navItem}
          data-is-selected={currentRoute === route}
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

const MyAccountMenu = ({
  avatarImageUrl,
  accountName,
  items,
}: MyAccountMenuProps) => {
  const { isDesktop } = useScreenResize()

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
          <Button
            className={styles.switchButton}
            variant="secondary"
            size="small"
          >
            Switch
          </Button>
        </div>
      ) : null}
      <Nav items={items} />
    </div>
  )
}

export default MyAccountMenu
