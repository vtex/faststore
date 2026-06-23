import type { UserOrderDeliveryOptionsData } from '@generated/graphql'
import { camelCaseToTitle } from 'src/utils/utilities'
import Card from '../../../components/Card'

interface DeliveryCardProps {
  title?: string
  deliveryOptionsData?: UserOrderDeliveryOptionsData
  fields?: Array<{
    name: string
    value: string
    refId?: string
  }>
}

export default function DeliveryCard({
  title = 'Delivery',
  deliveryOptionsData,
  fields,
}: DeliveryCardProps) {
  const deliveryOptions = deliveryOptionsData?.deliveryOptions ?? []
  const contact = deliveryOptionsData?.contact

  return (
    <Card title={title} data-fs-order-delivery-card>
      <div data-fs-delivery-methods>
        {deliveryOptions.map((option) => (
          <p key={option.friendlyDeliveryOptionName} data-fs-delivery-method>
            {option.friendlyDeliveryOptionName}
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
