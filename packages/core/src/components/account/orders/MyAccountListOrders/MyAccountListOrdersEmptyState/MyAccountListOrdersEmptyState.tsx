import Link from 'next/link'
import { Icon } from '@faststore/ui'

export default function MyAccountListOrdersEmptyState() {
  return (
    <div data-fs-list-orders-empty-state>
      <div data-fs-list-orders-empty-state-image>
        <Icon name="Bag2" width={56} height={56} />
        <h2 data-fs-list-orders-empty-state-title>You don’t have any orders</h2>
      </div>

      <Link data-fs-list-orders-empty-state-link href="/">
        Start shopping
      </Link>
    </div>
  )
}
