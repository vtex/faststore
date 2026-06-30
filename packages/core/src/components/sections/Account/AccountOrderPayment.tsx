import PaymentCard from 'src/components/account/orders/OrderDetails/PaymentCard'
import {
  type OrderPaymentSectionLabels,
  defaultOrderPaymentLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrderPaymentProps = OrderPaymentSectionLabels

const AccountOrderPayment = (props: AccountOrderPaymentProps) => {
  const labels = { ...defaultOrderPaymentLabels, ...props }
  const { order } = useAccountPageData<AccountOrderDetailsPageData>()

  if (!order) {
    return null
  }

  return (
    <Section className="section-account-order-payment">
      <PaymentCard
        currencyCode={order.storePreferencesData.currencyCode}
        paymentData={order.paymentData}
        allowCancellation={order.allowCancellation}
        labels={labels}
      />
    </Section>
  )
}

AccountOrderPayment.$componentKey = 'AccountOrderPayment'

export default AccountOrderPayment
