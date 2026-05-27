import {
  OrderDetailsHeader,
  type OrderDetailsHeaderProps,
} from 'src/components/account/orders/OrderDetails/OrderDetailsHeader'
import { defaultOrderDetailsHeaderLabels } from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrderDetailsProps = OrderDetailsHeaderProps['labels']

const AccountOrderDetails = ({
  orderNumberPrefix = defaultOrderDetailsHeaderLabels.orderNumberPrefix,
  goBackLabel = defaultOrderDetailsHeaderLabels.goBackLabel,
  cancelOrderLabel = defaultOrderDetailsHeaderLabels.cancelOrderLabel,
  reorderLabel = defaultOrderDetailsHeaderLabels.reorderLabel,
  notNowLabel = defaultOrderDetailsHeaderLabels.notNowLabel,
  cancelConfirmMessage = defaultOrderDetailsHeaderLabels.cancelConfirmMessage,
  cancelSuccessToast = defaultOrderDetailsHeaderLabels.cancelSuccessToast,
  cancelErrorToast = defaultOrderDetailsHeaderLabels.cancelErrorToast,
  approveLabel = defaultOrderDetailsHeaderLabels.approveLabel,
  rejectLabel = defaultOrderDetailsHeaderLabels.rejectLabel,
}: AccountOrderDetailsProps) => {
  const { order, orderStatusLabels } =
    useAccountPageData<AccountOrderDetailsPageData>()

  if (!order) {
    return null
  }

  return (
    <Section className="section-account-order-details">
      <OrderDetailsHeader
        order={order}
        statusLabels={orderStatusLabels}
        labels={{
          orderNumberPrefix,
          goBackLabel,
          cancelOrderLabel,
          reorderLabel,
          notNowLabel,
          cancelConfirmMessage,
          cancelSuccessToast,
          cancelErrorToast,
          approveLabel,
          rejectLabel,
        }}
      />
    </Section>
  )
}

AccountOrderDetails.$componentKey = 'AccountOrderDetails'

export default AccountOrderDetails
