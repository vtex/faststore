import { Button, Avatar, Link } from '@faststore/ui'
import { useRouter } from 'next/router'

import styles from '../section.module.scss'

import useScreenResize from 'src/sdk/ui/useScreenResize'

interface NavItem {
  title: string
  route: string
  isOpen?: boolean
}

export interface MyAccountMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  avatarImageUrl?: string
  accountName: string
  items: NavItem[]
}

const AvatarContainer = ({
  imageUrl,
  name,
}: { imageUrl?: string; name: string }) => (
  <div className={styles.avatarContainer}>
    <Avatar imageUrl={imageUrl} alt={name}></Avatar>
    <h2>{name}</h2>
  </div>
)

const Account = ({
  avatarImageUrl,
  accountName,
}: Pick<MyAccountMenuProps, 'avatarImageUrl' | 'accountName'>) => (
  <div className={styles.account}>
    <AvatarContainer imageUrl={avatarImageUrl} name={accountName} />
    <Button className={styles.switchButton} variant="secondary" size="small">
      Switch
    </Button>
  </div>
)

const NavItem = ({ title, route, isOpen }: NavItem) => (
  <li className={styles.navItem} data-is-open={isOpen}>
    <Link href={route} tabIndex={0}>
      {title}
    </Link>
  </li>
)

const Nav = ({ items }: Pick<MyAccountMenuProps, 'items'>) => {
  const router = useRouter()
  const currentRoute = router.pathname.split('/').pop()

  return (
    <ul className={styles.nav}>
      {items.map((item) => (
        <NavItem
          key={item.title}
          {...item}
          isOpen={currentRoute === item.route}
        />
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
        <Account avatarImageUrl={avatarImageUrl} accountName={accountName} />
      ) : null}
      <Nav items={items} />
    </div>
  )
}

export default MyAccountMenu
