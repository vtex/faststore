import type { PropsWithChildren } from 'react'
import menuRoutes from 'src/customizations/src/myAccount/navigation'
import { USER_DETAILS_ROUTE } from 'src/sdk/account/getMyAccountRoutes'
import MyAccountMenu from '../MyAccountMenu'
import styles from '../section.module.scss'

export type MyAccountLayoutProps = {
  isRepresentative?: boolean
}

/* ######################################### */
/* Mocked Data until development is finished */
const mockedUserName = 'Mocked Username'

/* ######################################### */

const ROUTES_ONLY_FOR_REPRESENTATIVE = [USER_DETAILS_ROUTE]

const MyAccountLayout = ({
  children,
  isRepresentative = true,
}: PropsWithChildren<MyAccountLayoutProps>) => {
  const routes = isRepresentative
    ? menuRoutes
    : menuRoutes.filter(
        ({ route }) => !ROUTES_ONLY_FOR_REPRESENTATIVE.includes(route)
      )

  return (
    <div className={styles.layout}>
      <MyAccountMenu accountName={mockedUserName} items={routes} />
      <section>{children}</section>
    </div>
  )
}
export default MyAccountLayout
