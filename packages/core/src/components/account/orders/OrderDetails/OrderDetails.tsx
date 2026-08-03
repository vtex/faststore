import type {
  ServerOrderDetailsQueryQuery,
  UserOrderDeliveryOption,
  UserOrderDeliveryOptionsData,
} from '@generated/graphql'
import type { OrderStatusKey } from 'src/utils/userOrderStatus'
import BudgetsCard from './BudgetsCard'
import DeliveryCard from './DeliveryCard'
import { DeliveryOptionAccordion } from './DeliveryOptionAccordion'
import MoreInformationCard from './MoreInformationCard'
import OrderedByCard from './OrderedByCard'
import PaymentCard from './PaymentCard'
import StatusCard from './StatusCard'
import SummaryCard from './SummaryCard'
import { OrderDetailsHeader, OrderDetailsPageShell } from './OrderDetailsHeader'

export interface OrderDetailsProps {
  order: ServerOrderDetailsQueryQuery['userOrder']
}

/**
 * @deprecated Use CMS section wrappers (AccountOrderDetails, AccountOrderStatus, …)
 * rendered via RenderSectionsBase on the order details page.
 */
export default function OrderDetails({ order }: OrderDetailsProps) {
  const moreInformationCustomFields = order?.customFields?.find(
    (field) => field.type === 'order'
  )?.fields

  return (
    <OrderDetailsPageShell>
      <OrderDetailsHeader order={order} />

      <main data-fs-order-details-content>
        <OrderedByCard
          clientProfileData={order.clientProfileData}
          shopper={order.shopper}
        />

        <DeliveryCard
          deliveryOptionsData={
            order.deliveryOptionsData as UserOrderDeliveryOptionsData
          }
          fields={
            order?.customFields?.find((field) => field.type === 'address')
              ?.fields || []
          }
        />

        <StatusCard
          status={order.status as OrderStatusKey}
          creationDate={order.creationDate}
        />

        <PaymentCard
          currencyCode={order.storePreferencesData.currencyCode}
          paymentData={order.paymentData}
          allowCancellation={order.allowCancellation}
        />

        <SummaryCard
          totals={order.totals}
          currencyCode={order.storePreferencesData.currencyCode}
          transactions={order.paymentData.transactions}
        />

        {order.deliveryOptionsData.deliveryOptions.map((option) => (
          <DeliveryOptionAccordion
            key={option.friendlyDeliveryOptionName}
            deliveryOption={option as UserOrderDeliveryOption}
            contact={order.deliveryOptionsData.contact}
            currencyCode={order.storePreferencesData.currencyCode}
            customFields={order.customFields.filter(
              (field) => field.type === 'item'
            )}
          />
        ))}

        {moreInformationCustomFields?.length > 0 && (
          <MoreInformationCard fields={moreInformationCustomFields} />
        )}

        {order.budgetData && (
          <BudgetsCard
            budgetData={order.budgetData}
            currencyCode={order.storePreferencesData.currencyCode}
          />
        )}
      </main>
    </OrderDetailsPageShell>
  )
}
