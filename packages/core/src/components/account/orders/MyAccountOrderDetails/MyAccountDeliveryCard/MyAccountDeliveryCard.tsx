import type { UserOrderDeliveryOptionsData } from '../../../../../../@generated/graphql'
import { camelCaseToTitle } from '../../../../../utils/utilities'
import MyAccountCard from '../../../components/MyAccountCard'

interface MyAccountDeliveryCardProps {
  deliveryOptionsData?: UserOrderDeliveryOptionsData
  fields?: Array<{
    name: string
    value: string
    refId?: string
  }>
}

export default function MyAccountDeliveryCard({
  deliveryOptionsData,
  fields,
}: MyAccountDeliveryCardProps) {
  return (
    <MyAccountCard title="Delivery" data-fs-order-delivery-card>
      <div data-fs-delivery-methods>
        {deliveryOptionsData.deliveryOptions.map((option, index) => (
          <p key={option.friendlyDeliveryOptionName} data-fs-delivery-method>
            {option.friendlyDeliveryOptionName}
          </p>
        ))}
      </div>

      {deliveryOptionsData.contact && (
        <div data-fs-delivery-contact>
          <p data-fs-delivery-contact-name>
            {deliveryOptionsData.contact.name}
          </p>
          {deliveryOptionsData.contact.phone && (
            <p data-fs-delivery-contact-phone>
              {deliveryOptionsData.contact.phone}
            </p>
          )}
          {fields?.length > 0 && (
            <p data-fs-delivery-contact-fields>
              {`${camelCaseToTitle(fields[0]?.name)}: ${fields[0]?.value}`}
            </p>
          )}
        </div>
      )}
    </MyAccountCard>
  )
}
