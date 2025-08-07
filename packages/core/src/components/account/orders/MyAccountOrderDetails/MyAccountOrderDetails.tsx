import { Icon as UIIcon, IconButton as UIIconButton } from '@faststore/ui'
import MyAccountStatusCard from 'src/components/account/orders/MyAccountOrderDetails/MyAccountStatusCard'
import MyAccountBuyingPolicyAlert from './MyAccountBuyingPolicyAlert'
import MyAccountDeliveryCard from './MyAccountDeliveryCard'
import { MyAccountDeliveryOptionAccordion } from './MyAccountDeliveryOptionAccordion'
import MyAccountOrderActions from './MyAccountOrderActions'
import MyAccountOrderedByCard from './MyAccountOrderedByCard'
import MyAccountPaymentCard from './MyAccountPaymentCard'
import MyAccountSummaryCard from './MyAccountSummaryCard'

import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import type { OrderStatusKey } from '../../../../utils/userOrderStatus'
import MyAccountStatusBadge from '../../components/MyAccountStatusBadge'
import MyAccountMoreInformationCard from './MyAccountMoreInformationCard'
import styles from './section.module.scss'

export interface MyAccountOrderDetailsProps {
  order: ServerOrderDetailsQueryQuery['userOrder']
}

const MIN_HISTORY_LENGTH_TO_GO_BACK = 2

export default function MyAccountOrderDetails({
  order,
}: MyAccountOrderDetailsProps) {
  const moreInformationCustomFields = order?.customFields?.find(
    (field) => field.type === 'order'
  )?.fields

  return (
    <div className={styles.page} data-fs-order-details>
      <header data-fs-order-details-header>
        <div data-fs-order-details-header-title>
          <a href="/account/orders">
            <UIIconButton
              data-fs-order-details-header-back-button
              size="small"
              aria-label="Go back"
              icon={<UIIcon height={20} width={20} name="ArrowLeft" />}
              type="button"
            />
          </a>
          <div data-fs-order-details-header-title-wrapper>
            <h1 data-fs-order-details-header-title-text>
              Order #{order.orderId}
            </h1>
            <MyAccountStatusBadge
              status={order.status}
              statusFallback={order.statusDescription}
            />
          </div>
        </div>

        <MyAccountOrderActions
          allowCancellation={order.allowCancellation}
          orderId={order.orderId}
          customerEmail={order.clientProfileData?.email}
        />
      </header>

      <main data-fs-order-details-content>
        {order.ruleForAuthorization && (
          <MyAccountBuyingPolicyAlert
            ruleForAuthorization={order.ruleForAuthorization}
            onAuthorizationComplete={() => window.location.reload()}
          />
        )}

        <MyAccountOrderedByCard
          clientProfileData={order.clientProfileData}
          shopperName={order.shopperName}
        />

        <MyAccountDeliveryCard
          deliveryOptionsData={order.deliveryOptionsData}
          fields={
            order?.customFields?.find((field) => field.type === 'address')
              ?.fields || []
          }
        />

        <MyAccountStatusCard
          status={order.status as OrderStatusKey}
          creationDate={order.creationDate}
        />

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
            currencyCode={order.storePreferencesData.currencyCode}
            customFields={order.customFields.filter(
              (field) => field.type === 'item'
            )}
          />
        ))}

        {moreInformationCustomFields?.length > 0 && (
          <MyAccountMoreInformationCard fields={moreInformationCustomFields} />
        )}
      </main>
    </div>
  )
}
