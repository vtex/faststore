import {
  Button as UIButton,
  Badge as UIBadge,
  Icon as UIIcon,
  IconButton as UIIconButton,
} from '@faststore/ui'
import MyAccountStatusCard from 'src/components/account/orders/MyAccountOrderDetails/MyAccountStatusCard'
import MyAccountOrderedByCard from './MyAccountOrderedByCard'
import MyAccountDeliveryCard from './MyAccountDeliveryCard'
import MyAccountPaymentCard from './MyAccountPaymentCard'
import MyAccountSummaryCard from './MyAccountSummaryCard'

import styles from './section.module.scss'

export interface MyAccountOrderDetailsProps {
  orderId: string
}

export default function MyAccountOrderDetails({
  orderId,
}: MyAccountOrderDetailsProps) {
  return (
    <div className={styles.page} data-fs-order-details>
      <header data-fs-order-details-header>
        <div data-fs-order-details-header-title>
          <UIIconButton
            size="small"
            aria-label="Go back"
            icon={<UIIcon name="ArrowLeft" />}
          />
          <h2>Order #{orderId}</h2>
          <UIBadge variant="warning">Pending approval</UIBadge>
        </div>
        <div data-fs-order-details-header-actions>
          <UIButton variant="secondary" size="small">
            Cancel order
          </UIButton>
          <UIButton
            variant="secondary"
            size="small"
            icon={<UIIcon name="XCircle" />}
          >
            Reject
          </UIButton>
          <UIButton
            variant="primary"
            size="small"
            icon={<UIIcon name="CircleCheck" />}
          >
            Approve
          </UIButton>
        </div>
      </header>
      <main data-fs-order-details-content>
        <MyAccountOrderedByCard />
        <MyAccountDeliveryCard />
        <MyAccountStatusCard />
        <MyAccountPaymentCard />
        <MyAccountSummaryCard />
      </main>
    </div>
  )
}
