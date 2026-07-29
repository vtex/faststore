import type { PropsWithChildren } from 'react'
import menuRoutes from 'src/customizations/src/myAccount/navigation'
import {
  type AccountNavigationLabels,
  ROUTES_REQUIRING_AD_HOC_CARD_ACCESS,
  USER_DETAILS_ROUTE,
  getExtraMyAccountRoutes,
  getMyAccountRoutes,
} from 'src/sdk/account/getMyAccountRoutes'
import Menu from '../Menu'
import styles from '../section.module.scss'

export type LayoutProps = {
  accountName: string
  isRepresentative?: boolean
  /**
   * Whether the buyer is allowed into `useAdHocCard`-gated routes (currently
   * just Cards — spec US-4). Defaults to `true` so unaffiliated/B2C buyers,
   * for whom this check never applies, are never accidentally gated.
   */
  hasAdHocCardAccess?: boolean
  navigationLabels?: AccountNavigationLabels
}

const ROUTES_ONLY_FOR_REPRESENTATIVE = [USER_DETAILS_ROUTE]

const Layout = ({
  children,
  accountName,
  isRepresentative = true,
  hasAdHocCardAccess = true,
  navigationLabels,
}: PropsWithChildren<LayoutProps>) => {
  const menuItems = navigationLabels
    ? getMyAccountRoutes({
        routes: getExtraMyAccountRoutes(menuRoutes),
        labels: navigationLabels,
      })
    : menuRoutes

  const routes = menuItems.filter(({ route }) => {
    if (!isRepresentative && ROUTES_ONLY_FOR_REPRESENTATIVE.includes(route)) {
      return false
    }
    if (
      !hasAdHocCardAccess &&
      ROUTES_REQUIRING_AD_HOC_CARD_ACCESS.includes(route)
    ) {
      return false
    }
    return true
  })

  return (
    <section className={styles.layout}>
      <Menu accountName={accountName} items={routes} />
      <div data-fs-account-layout-content>{children}</div>
    </section>
  )
}
export default Layout
