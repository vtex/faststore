import type { ReactNode } from 'react'
import type {
  UserOrderDeliveryOption,
  UserOrderDeliveryOptionsContact,
} from '../../../../../../@generated/graphql'

interface InfoContainerProps {
  title: string
  children: ReactNode
}

function InfoContainer({ title, children }: InfoContainerProps) {
  return (
    <div data-fs-delivery-option-accordion-info-container>
      <span data-fs-delivery-option-accordion-info-title>{title}</span>
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
        <InfoContainer title="Recipient">
          <span data-fs-delivery-option-accordion-info>
            <strong>{contact.name}</strong>
          </span>
          {contact.phone && (
            <span data-fs-delivery-option-accordion-info>{contact.phone}</span>
          )}
          {contact.email && (
            <span data-fs-delivery-option-accordion-info>{contact.email}</span>
          )}
        </InfoContainer>
      )}

      <InfoContainer title={isPickup ? 'Store address' : 'Delivery address'}>
        <span data-fs-delivery-option-accordion-info>
          <strong>{address.city}</strong>
        </span>
        <span data-fs-delivery-option-accordion-info>{address.street}</span>
        <span
          data-fs-delivery-option-accordion-info
        >{`${address.postalCode}${address.state ? `, ${address.state}` : ''}${address.country ? `, ${address.country}.` : ''}`}</span>
      </InfoContainer>

      {/* TODO: Validate this after we check the return from api  */}
      {isPickup && deliveryOption.deliveryWindow && (
        <InfoContainer title="Store Hours">
          <span data-fs-delivery-option-accordion-info>
            From:{' '}
            {new Date(
              deliveryOption.deliveryWindow.startDateUtc
            ).toLocaleString()}
          </span>
          <span data-fs-delivery-option-accordion-info>
            To:{' '}
            {new Date(
              deliveryOption.deliveryWindow.endDateUtc
            ).toLocaleString()}
          </span>
        </InfoContainer>
      )}
    </div>
  )
}

export default MyAccountDeliveryOptionAccordionDeliveryInfo
