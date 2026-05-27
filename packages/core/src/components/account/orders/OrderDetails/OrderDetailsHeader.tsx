import { Icon as UIIcon, IconButton as UIIconButton } from '@faststore/ui'
import type { PropsWithChildren } from 'react'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import StatusBadge from '../../components/StatusBadge'
import BuyingPolicyAlert from './BuyingPolicyAlert'
import OrderActions from './OrderActions'
import ReorderButton from './ReorderButton'
import {
  type OrderDetailsHeaderLabels,
  resolveOrderDetailsHeaderLabels,
} from './orderDetailsLabels'
import styles from './section.module.scss'

export type OrderDetailsHeaderProps = {
  order: ServerOrderDetailsQueryQuery['userOrder']
  labels?: OrderDetailsHeaderLabels
}

export function OrderDetailsHeader({
  order,
  labels: labelsProp,
}: OrderDetailsHeaderProps) {
  const labels = resolveOrderDetailsHeaderLabels(labelsProp)

  return (
    <>
      <header data-fs-order-details-header>
        <div data-fs-order-details-header-title>
          <a href="/pvt/account/orders">
            <UIIconButton
              data-fs-order-details-header-back-button
              size="small"
              aria-label={labels.goBackLabel}
              icon={<UIIcon name="ArrowLeft" />}
              type="button"
            />
          </a>
          <div data-fs-order-details-header-title-wrapper>
            <h1 data-fs-order-details-header-title-text>
              {labels.orderNumberPrefix}
              {order.orderId}
            </h1>
            <StatusBadge
              status={order.status}
              statusFallback={order.statusDescription}
            />
          </div>
        </div>

        <div data-fs-order-details-header-actions>
          <ReorderButton order={order} label={labels.reorderLabel} />
          <OrderActions
            allowCancellation={order.allowCancellation}
            orderId={order.orderId}
            customerEmail={order.clientProfileData?.email}
            order={order}
            labels={labels}
          />
        </div>
      </header>

      {order.ruleForAuthorization && (
        <BuyingPolicyAlert
          ruleForAuthorization={order.ruleForAuthorization}
          onAuthorizationComplete={() => window.location.reload()}
          labels={{
            approveLabel: labels.approveLabel,
            rejectLabel: labels.rejectLabel,
          }}
        />
      )}
    </>
  )
}

export function OrderDetailsPageShell({ children }: PropsWithChildren) {
  return (
    <div className={styles.page} data-fs-order-details>
      {children}
    </div>
  )
}
