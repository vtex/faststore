import type { UserOrderDeliveryOptionsData } from '@generated/graphql'
import { camelCaseToTitle } from 'src/utils/utilities'
import Card from '../../../components/Card'
import {
  getDeliveryOptionKey,
  getDeliveryOptionLabel,
} from '../getDeliveryOptionLabel'
import {
  type OrderDeliverySectionLabels,
  resolveOrderDeliveryLabels,
} from '../orderDetailsLabels'

interface DeliveryCardProps {
  title?: string
  deliveryOptionsData?: UserOrderDeliveryOptionsData
  labels?: OrderDeliverySectionLabels
  fields?: Array<{
    name: string
    value: string
    refId?: string
  }>
}

export default function DeliveryCard({
  title = 'Delivery',
  deliveryOptionsData,
  labels: labelsProp,
  fields,
}: Readonly<DeliveryCardProps>) {
  const labels = resolveOrderDeliveryLabels(labelsProp)
  const deliveryOptions = deliveryOptionsData?.deliveryOptions ?? []
  const contact = deliveryOptionsData?.contact

  return (
    <Card title={title} data-fs-order-delivery-card>
      <div data-fs-delivery-methods>
        {deliveryOptions.map((option) => (
          <p key={getDeliveryOptionKey(option)} data-fs-delivery-method>
            {getDeliveryOptionLabel(option, labels)}
          </p>
        ))}
      </div>

      {contact && (
        <div data-fs-delivery-contact>
          <p data-fs-delivery-contact-name>{contact.name}</p>
          {contact.phone && (
            <p data-fs-delivery-contact-phone>{contact.phone}</p>
          )}
          {fields?.length > 0 && (
            <p data-fs-delivery-contact-fields>
              {`${camelCaseToTitle(fields[0]?.name)}: ${fields[0]?.value}`}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
