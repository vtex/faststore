import Link from 'next/link'
import { Icon } from '@faststore/ui'

import styles from './styles.module.scss'

export default function MyAccountListOrdersEmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <Icon name="Bag2" width={56} height={56} />
        <h2 className={styles.title}>You don’t have any orders</h2>
      </div>

      <Link href="/" className={styles.link}>
        Start shopping
      </Link>
    </div>
  )
}
