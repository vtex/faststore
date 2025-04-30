import {
  Badge as UIBadge,
  Button as UIButton,
  Icon as UIIcon,
  IconButton as UIIconButton,
} from '@faststore/ui'
import MyAccountStatusCard from 'src/components/account/orders/MyAccountOrderDetails/MyAccountStatusCard'
import MyAccountDeliveryCard from './MyAccountDeliveryCard'
import MyAccountOrderedByCard from './MyAccountOrderedByCard'
import MyAccountPaymentCard from './MyAccountPaymentCard'
import MyAccountSummaryCard from './MyAccountSummaryCard'
import { MyAccountDeliveryOptionAccordion } from './MyAccountDeliveryOptionAccordion'

import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import styles from './section.module.scss'

export interface MyAccountOrderDetailsProps {
  order: ServerOrderDetailsQueryQuery['userOrder']
}

export default function MyAccountOrderDetails({
  order,
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
          <h1 data-fs-order-details-header-title-text>
            Order #{order.orderId}
          </h1>
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
        <MyAccountOrderedByCard clientProfileData={order.clientProfileData} />
        <MyAccountDeliveryCard
          deliveryOptionsData={order.deliveryOptionsData}
        />
        <MyAccountStatusCard />
        <MyAccountPaymentCard
          currencyCode={order.storePreferencesData.currencyCode}
          paymentData={order.paymentData}
          allowCancellation={order.allowCancellation}
        />
        <MyAccountSummaryCard
          totals={order.totals}
          currencyCode={order.storePreferencesData.currencyCode}
          transactions={order.paymentData.transactions}
        />

        {order.deliveryOptionsData.deliveryOptions.map((option) => (
          <MyAccountDeliveryOptionAccordion
            key={option.friendlyDeliveryOptionName}
            deliveryOption={option}
            contact={order.deliveryOptionsData.contact}
          />
        ))}
      </main>
    </div>
  )
}
