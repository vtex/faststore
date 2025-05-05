import MyAccountCard from '../../../components/MyAccountCard'
import type { UserOrderDeliveryOptionsData } from '@generated/graphql'

interface MyAccountDeliveryCardProps {
  deliveryOptionsData?: UserOrderDeliveryOptionsData
}

export default function MyAccountDeliveryCard({
  deliveryOptionsData,
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
        </div>
      )}
    </MyAccountCard>
  )
}
