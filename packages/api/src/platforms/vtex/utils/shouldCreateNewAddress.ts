import { IStoreSession } from '../../../__generated__/schema'
import { IncrementedAddress } from '../clients/commerce/types/IncrementedAddress'
import { OrderForm } from '../clients/commerce/types/OrderForm'
import { SelectedAddress } from '../clients/commerce/types/ShippingData'

export const shouldCreateNewAddress = (
  orderForm: OrderForm,
  session: IStoreSession,
  addressChanged: boolean,
  incrementedAddress?: IncrementedAddress
) => {
  const postalCode = session.postalCode
  const geoCoordinates = session.geoCoordinates
  const availableAddresses = orderForm?.shippingData?.availableAddresses ?? []

  if (!addressChanged) {
    return [orderForm?.shippingData?.address]
  }

  if (addressChanged && availableAddresses.length > 0) {
    // Validate if the address from the session already exists at the availableAddresses to avoid duplication
    if (postalCode && geoCoordinates) {
      for (const address of availableAddresses) {
        const matcher =
          address.postalCode === postalCode &&
          address.geoCoordinates[0] === geoCoordinates.longitude &&
          address.geoCoordinates[1] === geoCoordinates.latitude
        if (matcher) {
          return [address]
        }
      }
    }
    if (postalCode) {
      for (const address of availableAddresses) {
        const matcher = address.postalCode === postalCode
        if (matcher) {
          return [address]
        }
      }
    }
    if (geoCoordinates) {
      for (const address of availableAddresses) {
        const matcher =
          address.geoCoordinates[0] === geoCoordinates.longitude &&
          address.geoCoordinates[1] === geoCoordinates.latitude
        if (matcher) {
          return [address]
        }
      }
    }
  }

  const addressSession: SelectedAddress = {
    addressType: session.addressType || null,
    postalCode: postalCode || incrementedAddress?.postalCode || null,
    city: incrementedAddress?.city || null,
    state: incrementedAddress?.state || null,
    country: session.country || incrementedAddress?.country || null,
    street: incrementedAddress?.street || null,
    number: incrementedAddress?.number || null,
    neighborhood: incrementedAddress?.neighborhood || null,
    complement: incrementedAddress?.complement || null,
    reference: incrementedAddress?.reference || null,
    geoCoordinates: [], // Initialize with default value
  }

  return [addressSession]
}
