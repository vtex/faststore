import StatusCard from 'src/components/account/orders/OrderDetails/StatusCard'
import {
  type OrderStatusSectionLabels,
  defaultOrderStatusLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import type {
  OrderStatusCmsLabels,
  OrderStatusKey,
} from 'src/utils/userOrderStatus'
import Section from '../Section'

export type AccountOrderStatusProps = OrderStatusSectionLabels &
  OrderStatusCmsLabels

const AccountOrderStatus = ({
  statusTitle = defaultOrderStatusLabels.statusTitle,
  orderPlacedStep = defaultOrderStatusLabels.orderPlacedStep,
  approvedStep = defaultOrderStatusLabels.approvedStep,
  pendingApprovalStep = defaultOrderStatusLabels.pendingApprovalStep,
  deniedStep = defaultOrderStatusLabels.deniedStep,
  paymentApprovedStep = defaultOrderStatusLabels.paymentApprovedStep,
  paymentPendingStep = defaultOrderStatusLabels.paymentPendingStep,
  paymentAuthorizationStep = defaultOrderStatusLabels.paymentAuthorizationStep,
  paymentDeniedStep = defaultOrderStatusLabels.paymentDeniedStep,
  readyForDeliveryStep = defaultOrderStatusLabels.readyForDeliveryStep,
  handlingStep = defaultOrderStatusLabels.handlingStep,
  canceledStep = defaultOrderStatusLabels.canceledStep,
  invoicedStep = defaultOrderStatusLabels.invoicedStep,
  deliveredStep = defaultOrderStatusLabels.deliveredStep,
  shipOrderStep = defaultOrderStatusLabels.shipOrderStep,
}: AccountOrderStatusProps) => {
  const { order, orderStatusLabels } =
    useAccountPageData<AccountOrderDetailsPageData>()

  if (!order) {
    return null
  }

  return (
    <Section className="section-account-order-status">
      <StatusCard
        status={order.status as OrderStatusKey}
        creationDate={order.creationDate}
        statusLabels={orderStatusLabels}
        labels={{
          statusTitle,
          orderPlacedStep,
          approvedStep,
          pendingApprovalStep,
          deniedStep,
          paymentApprovedStep,
          paymentPendingStep,
          paymentAuthorizationStep,
          paymentDeniedStep,
          readyForDeliveryStep,
          handlingStep,
          canceledStep,
          invoicedStep,
          deliveredStep,
          shipOrderStep,
        }}
      />
    </Section>
  )
}

AccountOrderStatus.$componentKey = 'AccountOrderStatus'

export default AccountOrderStatus
