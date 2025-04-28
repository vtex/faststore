import type { DeliveryOptionsData } from './__mocks__/types'
import MyAccountCard from '../../../components/MyAccountCard'

interface MyAccountDeliveryCardProps {
  deliveryOptionsData?: DeliveryOptionsData
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
