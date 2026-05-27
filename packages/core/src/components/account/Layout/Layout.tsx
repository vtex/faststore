import type { PropsWithChildren } from 'react'
import menuRoutes from 'src/customizations/src/myAccount/navigation'
import {
  type AccountNavigationLabels,
  USER_DETAILS_ROUTE,
  getExtraMyAccountRoutes,
  getMyAccountRoutes,
} from 'src/sdk/account/getMyAccountRoutes'
import Menu from '../Menu'
import styles from '../section.module.scss'

export type LayoutProps = {
  accountName: string
  isRepresentative?: boolean
  navigationLabels?: AccountNavigationLabels
}

const ROUTES_ONLY_FOR_REPRESENTATIVE = [USER_DETAILS_ROUTE]

const Layout = ({
  children,
  accountName,
  isRepresentative = true,
  navigationLabels,
}: PropsWithChildren<LayoutProps>) => {
  const menuItems = navigationLabels
    ? getMyAccountRoutes({
        routes: getExtraMyAccountRoutes(menuRoutes),
        labels: navigationLabels,
      })
    : menuRoutes

  const routes = isRepresentative
    ? menuItems
    : menuItems.filter(
        ({ route }) => !ROUTES_ONLY_FOR_REPRESENTATIVE.includes(route)
      )

  return (
    <section className={styles.layout}>
      <Menu accountName={accountName} items={routes} />
      <div data-fs-account-layout-content>{children}</div>
    </section>
  )
}
export default Layout
