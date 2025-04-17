import type { PropsWithChildren } from 'react'
import menuRoutes from 'src/customizations/src/myAccount/navigation'
import MyAccountMenu from '../MyAccountMenu'
import styles from '../section.module.scss'

export type MyAccountLayoutProps = {}

/* ######################################### */
/* Mocked Data until development is finished */
const mockedUserName = 'Mocked Username'

/* ######################################### */

const MyAccountLayout = ({
  children,
}: PropsWithChildren<MyAccountLayoutProps>) => {
  return (
    <div className={styles.layout}>
      <MyAccountMenu accountName={mockedUserName} items={menuRoutes} />
      <section>{children}</section>
    </div>
  )
}

export default MyAccountLayout
