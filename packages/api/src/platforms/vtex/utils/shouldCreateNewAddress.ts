import { IStoreSession } from '../../../__generated__/schema'
import { OrderForm } from '../clients/commerce/types/OrderForm'

export const shouldCreateNewAddress = (
  orderForm: OrderForm,
  session: IStoreSession
) => {
  const availableAddresses = orderForm?.shippingData?.availableAddresses ?? null
  if (!availableAddresses) {
    return null
  }
  const postalCode = session.postalCode
  const geoCoordinates = session.geoCoordinates

  // Validate if the address from the session already exists at the availableAddresses to avoid duplication
  if (postalCode && geoCoordinates) {
    for (const address of availableAddresses) {
      const matcher =
        address.postalCode === postalCode &&
        address.geoCoordinates[0] === geoCoordinates.longitude &&
        address.geoCoordinates[1] === geoCoordinates.latitude
      if (matcher) {
        return address.addressId
      }
    }
  }
  if (postalCode) {
    for (const address of availableAddresses) {
      const matcher = address.postalCode === postalCode
      if (matcher) {
        return address.addressId
      }
    }
  }
  if (geoCoordinates) {
    for (const address of availableAddresses) {
      const matcher =
        address.geoCoordinates[0] === geoCoordinates.longitude &&
        address.geoCoordinates[1] === geoCoordinates.latitude
      if (matcher) {
        return address.addressId
      }
    }
  }
  return null
}
