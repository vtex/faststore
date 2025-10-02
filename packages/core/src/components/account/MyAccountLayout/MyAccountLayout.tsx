import type { PropsWithChildren } from 'react'
import menuRoutes from '../../../customizations/src/myAccount/navigation'
import { USER_DETAILS_ROUTE } from '../../../sdk/account/getMyAccountRoutes'
import MyAccountMenu from '../MyAccountMenu'
import styles from '../section.module.scss'

export type MyAccountLayoutProps = {
  accountName: string
  isRepresentative?: boolean
}

const ROUTES_ONLY_FOR_REPRESENTATIVE = [USER_DETAILS_ROUTE]

const MyAccountLayout = ({
  children,
  accountName,
  isRepresentative = true,
}: PropsWithChildren<MyAccountLayoutProps>) => {
  const routes = isRepresentative
    ? menuRoutes
    : menuRoutes.filter(
        ({ route }) => !ROUTES_ONLY_FOR_REPRESENTATIVE.includes(route)
      )

  return (
    <section className={styles.layout}>
      <MyAccountMenu accountName={accountName} items={routes} />
      <div data-fs-account-layout-content>{children}</div>
    </section>
  )
}
export default MyAccountLayout
