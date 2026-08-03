import OrderedByCard from 'src/components/account/orders/OrderDetails/OrderedByCard'
import {
  type OrderOrderedBySectionLabels,
  defaultOrderOrderedByLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrderOrderedByProps = OrderOrderedBySectionLabels

const AccountOrderOrderedBy = ({
  orderedByTitle = defaultOrderOrderedByLabels.orderedByTitle,
}: AccountOrderOrderedByProps) => {
  const { order } = useAccountPageData<AccountOrderDetailsPageData>()

  if (!order) {
    return null
  }

  return (
    <Section className="section-account-order-ordered-by">
      <OrderedByCard
        clientProfileData={order.clientProfileData}
        shopper={order.shopper}
        title={orderedByTitle}
      />
    </Section>
  )
}

AccountOrderOrderedBy.$componentKey = 'AccountOrderOrderedBy'

export default AccountOrderOrderedBy
