import DeliveryCard from 'src/components/account/orders/OrderDetails/DeliveryCard'
import { DeliveryOptionAccordion } from 'src/components/account/orders/OrderDetails/DeliveryOptionAccordion'
import {
  type OrderDeliverySectionLabels,
  defaultOrderDeliveryLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import type {
  UserOrderDeliveryOption,
  UserOrderDeliveryOptionsData,
} from '@generated/graphql'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrderDeliveryProps = OrderDeliverySectionLabels

const AccountOrderDelivery = (props: AccountOrderDeliveryProps) => {
  const labels = { ...defaultOrderDeliveryLabels, ...props }
  const { order } = useAccountPageData<AccountOrderDetailsPageData>()

  if (!order?.deliveryOptionsData) {
    return null
  }

  return (
    <Section className="section-account-order-delivery">
      <DeliveryCard
        deliveryOptionsData={
          order.deliveryOptionsData as UserOrderDeliveryOptionsData
        }
        fields={
          order.customFields?.find((field) => field.type === 'address')
            ?.fields || []
        }
        title={labels.deliveryTitle}
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
          labels={labels}
        />
      ))}
    </Section>
  )
}

AccountOrderDelivery.$componentKey = 'AccountOrderDelivery'

export default AccountOrderDelivery
