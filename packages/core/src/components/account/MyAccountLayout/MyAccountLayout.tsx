import type { PropsWithChildren } from 'react'
import menuRoutes from 'src/customizations/src/myAccount/navigation'
import MyAccountMenu from '../MyAccountMenu'
import styles from '../section.module.scss'

export type MyAccountLayoutProps = {
  accountName: string
}

const MyAccountLayout = ({
  children,
  accountName,
}: PropsWithChildren<MyAccountLayoutProps>) => {
  return (
    <div className={styles.layout}>
      <MyAccountMenu accountName={accountName} items={menuRoutes} />
      <section>{children}</section>
    </div>
  )
}

export default MyAccountLayout
