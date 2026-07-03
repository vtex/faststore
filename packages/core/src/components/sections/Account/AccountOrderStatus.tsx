import StatusCard from 'src/components/account/orders/OrderDetails/StatusCard'
import {
  type OrderStatusSectionLabels,
  defaultOrderStatusLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import type { OrderStatusKey } from 'src/utils/userOrderStatus'
import Section from '../Section'

export type AccountOrderStatusProps = OrderStatusSectionLabels

const AccountOrderStatus = ({
  statusTitle = defaultOrderStatusLabels.statusTitle,
  orderPlacedStep = defaultOrderStatusLabels.orderPlacedStep,
  paymentPendingStep = defaultOrderStatusLabels.paymentPendingStep,
  handlingStep = defaultOrderStatusLabels.handlingStep,
  invoicedStep = defaultOrderStatusLabels.invoicedStep,
  deliveredStep = defaultOrderStatusLabels.deliveredStep,
}: AccountOrderStatusProps) => {
  const { order } = useAccountPageData<AccountOrderDetailsPageData>()

  if (!order) {
    return null
  }

  return (
    <Section className="section-account-order-status">
      <StatusCard
        status={order.status as OrderStatusKey}
        creationDate={order.creationDate}
        labels={{
          statusTitle,
          orderPlacedStep,
          paymentPendingStep,
          handlingStep,
          invoicedStep,
          deliveredStep,
        }}
      />
    </Section>
  )
}

AccountOrderStatus.$componentKey = 'AccountOrderStatus'

export default AccountOrderStatus
