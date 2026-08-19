import type { ComponentProps } from 'react'
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

  const { deliveryOptionsData } = order

  return (
    <Section className="section-account-order-delivery">
      <DeliveryCard
        deliveryOptionsData={
          deliveryOptionsData as UserOrderDeliveryOptionsData
        }
        fields={
          (order.customFields?.find((field) => field?.type === 'address')
            ?.fields || []) as ComponentProps<typeof DeliveryCard>['fields']
        }
        title={labels.deliveryTitle}
      />
      {deliveryOptionsData.deliveryOptions?.map((option) => (
        <DeliveryOptionAccordion
          key={option?.friendlyDeliveryOptionName}
          deliveryOption={option as UserOrderDeliveryOption}
          contact={deliveryOptionsData.contact}
          currencyCode={order.storePreferencesData?.currencyCode ?? ''}
          customFields={
            order.customFields?.filter(
              (field) => field?.type === 'item'
            ) as ComponentProps<typeof DeliveryOptionAccordion>['customFields']
          }
          labels={labels}
        />
      ))}
    </Section>
  )
}

AccountOrderDelivery.$componentKey = 'AccountOrderDelivery'

export default AccountOrderDelivery
