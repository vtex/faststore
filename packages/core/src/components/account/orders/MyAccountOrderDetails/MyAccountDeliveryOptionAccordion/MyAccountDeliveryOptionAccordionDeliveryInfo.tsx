import type { ReactNode } from 'react'
import type {
  UserOrderDeliveryOption,
  UserOrderDeliveryOptionsContact,
} from '@generated/graphql'

interface InfoSectionProps {
  title: string
  children: ReactNode
}

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <div>
      <span data-fs-delivery-option-accordion-title>{title}</span>
      {children}
    </div>
  )
}

interface MyAccountDeliveryOptionAccordionDeliveryInfoProps {
  deliveryOption: UserOrderDeliveryOption
  contact?: UserOrderDeliveryOptionsContact | null
}

function MyAccountDeliveryOptionAccordionDeliveryInfo({
  deliveryOption,
  contact,
}: MyAccountDeliveryOptionAccordionDeliveryInfoProps) {
  const isPickup = deliveryOption.deliveryChannel === 'pickup-in-point'
  const address = isPickup
    ? deliveryOption.pickupStoreInfo?.address
    : deliveryOption.address

  if (!address && !contact && !deliveryOption.deliveryWindow) {
    return null
  }

  return (
    <div data-fs-delivery-option-accordion-delivery-info>
      {!isPickup && contact && (
        <InfoSection title="Recipient">
          <span>
            <strong>{contact.name}</strong>
          </span>
          {contact.phone && <span>{contact.phone}</span>}
          {contact.email && <span>{contact.email}</span>}
        </InfoSection>
      )}

      <InfoSection title={isPickup ? 'Store address' : 'Delivery address'}>
        <span>
          <strong>{address.city}</strong>
        </span>
        <span>{address.street}</span>
        <span>{`${address.postalCode}${address.state ? `, ${address.state}` : ''}${address.country ? `, ${address.country}.` : ''}`}</span>
      </InfoSection>

      {/* TODO: Validate this after we check the return from api  */}
      {isPickup && deliveryOption.deliveryWindow && (
        <InfoSection title="Store Hours">
          <span>
            From:{' '}
            {new Date(
              deliveryOption.deliveryWindow.startDateUtc
            ).toLocaleString()}
          </span>
          <span>
            To:{' '}
            {new Date(
              deliveryOption.deliveryWindow.endDateUtc
            ).toLocaleString()}
          </span>
        </InfoSection>
      )}
    </div>
  )
}

export default MyAccountDeliveryOptionAccordionDeliveryInfo
