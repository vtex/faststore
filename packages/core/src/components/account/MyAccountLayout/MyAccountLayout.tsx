import type { PropsWithChildren } from 'react'
import MyAccountMenu from '../MyAccountMenu'
import menuRoutes from 'src/customizations/src/myAccount/navigation'
import styles from '../section.module.scss'

export type MyAccountLayoutProps = {}

/* ######################################### */
/* Mocked Data until development is finished */
const username = 'John Cena'
/* ######################################### */

const MyAccountLayout = ({
  children,
}: PropsWithChildren<MyAccountLayoutProps>) => {
  return (
    <div className={styles.section}>
      <MyAccountMenu accountName={username} items={menuRoutes} />
      {children}
    </div>
  )
}

export default MyAccountLayout
